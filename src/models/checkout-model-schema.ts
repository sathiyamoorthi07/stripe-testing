import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

interface ICheckoutSession extends Document {
  cs_id: Schema.Types.Mixed;
  zone_id: ObjectId;
  plan_id: ObjectId;
  name: Schema.Types.String;
  type: Schema.Types.String;
  currency: Schema.Types.String;
  total_price: Schema.Types.Number;
  user_id: Schema.Types.Mixed;
  member_id: Schema.Types.Mixed;
  status: Schema.Types.Mixed;
  created_at: Date;
}
type CheckoutSessionModel = Model<ICheckoutSession>;
const CheckoutSessionModelSchema = new Schema<
  ICheckoutSession,
  CheckoutSessionModel
>({
  name: { type: Schema.Types.String },
  cs_id: { type: Schema.Types.Mixed },
  zone_id: { type: Schema.Types.ObjectId },
  plan_id: { type: Schema.Types.ObjectId },
  type: { type: Schema.Types.String, default: "subscription" },
  currency: { type: Schema.Types.String },
  total_price: { type: Schema.Types.Number },
  user_id: { type: Schema.Types.Mixed },
  member_id: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
});
//ProductItemModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.checkout_session ||
  model<ICheckoutSession>("checkout_session", CheckoutSessionModelSchema);
