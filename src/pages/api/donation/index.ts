// import dbMiddleware from "@/middleware/dbMiddleware";

import dbMiddleware from "@/middleware/db-middleware";
import donationModelSchema from "@/models/donation-model-schema";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default nextConnect()
  .use(dbMiddleware)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const donation = await donationModelSchema.find({});
      return res.status(200).json(donation);
    } catch (error) {}
  });
