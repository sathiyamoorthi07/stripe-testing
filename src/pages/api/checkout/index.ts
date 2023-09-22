import dbMiddleware from "@/middleware/db-middleware";
import checkoutModelSchema from "@/models/checkout-model-schema";
import doantionCampaignModelSchema from "@/models/doantion-campaign-model-schema";
import donationModelSchema from "@/models/donation-model-schema";
import profileInfoModelSchema from "@/models/profile-info-model-schema";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default nextConnect()
  .use(dbMiddleware)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query, body } = req;

    const { plan_id, type, currency, amount, name } = body;

    try {
      let donation: any;

      let list_item: any = {};

      if (type == "payment") {
        donation = {
          type: name,
          currency,
          amount,
        };
        list_item = {
          price_data: {
            currency: donation.currency,
            unit_amount: donation.amount * 100,
            product_data: {
              name: donation.type,
            },
          },
          quantity: 1,
        };
      } else if (type == "campaign") {
        const campaign = await doantionCampaignModelSchema.findOne({
          _id: plan_id,
        });

        donation = {
          type: campaign.title,
          currency: campaign.currency,
          amount: amount,
        };
        list_item = {
          price_data: {
            currency: donation.currency,
            unit_amount: donation.amount * 100,
            product_data: {
              name: donation.type,
            },
          },
          quantity: 1,
        };
      } else {
        donation = await donationModelSchema.findOne({
          _id: plan_id,
        });

        list_item = {
          price: donation.price_id,
          quantity: 1,
        };
      }
      const _user = await profileInfoModelSchema.findOne({
        _id: "6507f1de3447b3c2cc8bc2c4",
      });

      let customer_id: any;

      if (_user.customer_id) {
        customer_id = _user.customer_id;
      } else {
        const customer = await stripe.customers.create({
          email: _user.email_id,
        });

        const user_update = await profileInfoModelSchema.findOneAndUpdate(
          {
            _id: "6507f1de3447b3c2cc8bc2c4",
          },
          {
            customer_id: customer.id,
          }
        );

        customer_id = customer.id;
      }

      if (donation) {
        let new_checkout = {
          name: donation.type,
          type: type,
          currency: donation.currency,
          total_price: donation.amount,
          total_tax: 0,
          status: "PENDING",
          plan_id: plan_id,
          zone_id: _user.zone_id,
          user_id: _user.user_account_id,
          member_id: _user.user_short_id,
        };

        const _checkout = new checkoutModelSchema(new_checkout);
        await _checkout.save();

        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [list_item],
          mode: type == "subscription" ? "subscription" : "payment",
          customer: customer_id,
          success_url: `${req.headers.origin}/success`,
          cancel_url: `${req.headers.origin}/failed`,
        });

        _checkout.cs_id = checkoutSession.id;
        await _checkout.save();

        return res.status(200).json({
          cs_id: checkoutSession.id,
        });
      } else {
      }
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        status_code: 500,
        data: null,
        message: "server error",
      });
    }
  });
