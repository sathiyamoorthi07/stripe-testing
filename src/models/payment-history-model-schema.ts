import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IPaymentHistory extends Document {
  zone_id: Schema.Types.ObjectId;
  user_id: Schema.Types.Mixed;
  member_id: Schema.Types.Mixed;
  payment_via: String;
  plan: Schema.Types.String;
  type: Schema.Types.String;
  currency: Schema.Types.String;
  total_price: Schema.Types.Number;
  total_tax: Schema.Types.Number;
  status: Schema.Types.Mixed;
  created_at: Date;
  customer_id: Schema.Types.String;
  subscription_id: Schema.Types.String;
  invoice_id: Schema.Types.String;
}

type PaymentHistoryModel = Model<IPaymentHistory>;
const PaymentHistoryModelSchema = new Schema<
  IPaymentHistory,
  PaymentHistoryModel
>({
  zone_id: { type: Schema.Types.ObjectId },
  plan: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  currency: { type: Schema.Types.String },
  payment_via: { type: Schema.Types.String },
  total_price: { type: Schema.Types.Number },
  total_tax: { type: Schema.Types.Number },
  user_id: { type: Schema.Types.Mixed },
  member_id: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  customer_id: { type: Schema.Types.String },
  subscription_id: { type: Schema.Types.String },
  invoice_id: { type: Schema.Types.String },
});

export default models.payment_history ||
  model<IPaymentHistory>("payment_history", PaymentHistoryModelSchema);
