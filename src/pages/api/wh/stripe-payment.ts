import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
//@ts-ignore
import { buffer } from "micro";
import dbMiddleware from "@/middleware/db-middleware";
import checkoutModelSchema from "@/models/checkout-model-schema";
import paymentHistoryModelSchema from "@/models/payment-history-model-schema";
import subscriptionModelSchema from "@/models/subscription-model-schema";
import doantionCampaignModelSchema from "@/models/doantion-campaign-model-schema";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_ENDPOINT_KEY!;
export const config = {
  api: {
    bodyParser: false,
  },
};
export default nextConnect()
  .use(dbMiddleware)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    let event;

    const payloadString = (await buffer(req)).toString();
    let sig: any = "";
    if (process.env.NODE_ENV != "production") {
      sig = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret,
      });
    } else {
      sig = req.headers["stripe-signature"] || "";
    }

    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        sig,
        endpointSecret
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type == "checkout.session.completed") {
      const event_data: any = event.data.object;

      const response = await checkoutModelSchema.findOneAndUpdate(
        {
          cs_id: event_data.id,
        },
        {
          status: event_data.payment_status,
        },
        {
          new: true,
        }
      );

      if (event_data.mode == "subscription") {
        console.log("subscription", response);
        const subscription = await stripe.subscriptions.retrieve(
          event_data.subscription
        );

        const new_subscription = new subscriptionModelSchema({
          user_id: response.user_id,
          member_id: response.member_id,
          plan_id: response.plan_id,
          type: response.payment_type,
          zone_id: response.zone_id,
          subscription_id: event_data.subscription,
          customer_id: event_data.customer,
          start_date: subscription.current_period_start,
          expired_date: subscription.current_period_end,
        });
        await new_subscription.save();
      }

      if (response.type == "campaign") {
        const valetree_details = {
          user_id: response.user_id,
          member_id: response.member_id,
          amount: response.total_price,
          payment_via: "online",
          status: "paid",
          paid_at: new Date(),
        };

        const update_campaign =
          await doantionCampaignModelSchema.findOneAndUpdate(
            {
              _id: response.plan_id,
            },
            {
              $push: {
                volunteers: valetree_details,
              },
              $inc: { recived_amount: parseInt(response.total_price) },
            },
            {
              new: true,
            }
          );
      }

      const new_payment = new paymentHistoryModelSchema({
        user_id: response.user_id,
        member_id: response.member_id,
        plan: response.name,
        type: response.type,
        currency: response.currency.toUpperCase(),
        total_price: response.total_price,
        total_tax: response.total_tax,
        zone_id: response.zone_id,
        status: response.status,
        invoice_id: event_data.invoice,
        subscription_id: event_data.subscription,
        customer_id: event_data.customer,
        payment_via: "online",
        created_at: new Date(),
      });

      const success = await new_payment.save();
    }

    if (event.type == "invoice.payment_succeeded") {
      const event_data: any = event.data.object;
      if (
        event_data.status == "paid" &&
        event_data.billing_reason == "subscription_update"
      ) {
        const old_subscription = await subscriptionModelSchema.findOne({
          subscription_id: event_data.subscription,
        });

        const start_date = event_data.lines.data[0].period.start;
        const end_date = event_data.lines.data[0].period.end;

        if (old_subscription) {
          const updated_subscription = await subscriptionModelSchema
            .findOneAndUpdate(
              {
                subscription_id: event_data.subscription,
              },
              {
                start_date: start_date,
                end_date: end_date,
                updated_at: new Date(),
              },
              {
                new: true,
              }
            )
            .populate({ path: "plan", select: "type currency amount" });

          const new_payment = new paymentHistoryModelSchema({
            user_id: updated_subscription.user_id,
            member_id: updated_subscription.member_id,
            plan: updated_subscription.plan.type,
            payment_via: "online",
            type: updated_subscription.type,
            currency: updated_subscription.plan.currency,
            total_price: updated_subscription.plan.amount,
            zone_id: updated_subscription.zone_id,
            status: event_data.status,
            invoice_id: event_data.invoice,
            subscription_id: event_data.subscription,
            customer_id: event_data.customer,
            created_at: new Date(),
          });

          const success = await new_payment.save();
        }
      }
    }

    if (event.type == "invoice.payment_failed") {
      const event_data: any = event.data.object;
    }
    if (event.type == "checkout.session.async_payment_failed") {
      const event_data: any = event.data.object;
      console.log("checkout.session.async_payment_failed", event_data);
    }

    return res.json({ status: "OK" });
  });
