import dbConnect from "@/utils/db-connect";
import { NextApiResponse } from "next";
export default async function dbMiddleware(
  req: any,
  res: NextApiResponse,
  next: any
) {
  try {
    req.dbConn = await dbConnect();
  } catch (error: any) {
    //console.log("DB Exception", error?.message);
    res.write(error?.message);
    return res.end();
  }

  next();
}
