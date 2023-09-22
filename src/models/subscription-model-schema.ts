import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  Mixed,
  ObjectId,
} from "mongoose";
import donationModelSchema from "./donation-model-schema";

interface ISubscription extends Document {
  zone_id: ObjectId;
  plan_id: ObjectId;
  user_id: ObjectId;
  member_id: string;
  type: string;
  status: string;
  subscription_id: string;
  start_date: Mixed;
  expired_date: Mixed;
  created_at: Date;
  updated_at: Date;
}

type SubscriptionModel = Model<ISubscription>;
const SubscriptionModelSchema = new Schema<ISubscription, SubscriptionModel>({
  zone_id: { type: Schema.Types.ObjectId },
  plan_id: { type: Schema.Types.ObjectId },
  user_id: { type: Schema.Types.ObjectId },
  member_id: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ACTIVE" },
  subscription_id: { type: Schema.Types.String },
  start_date: { type: Schema.Types.Mixed },
  expired_date: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

SubscriptionModelSchema.set("toObject", { virtuals: true });
SubscriptionModelSchema.set("toJSON", { virtuals: true });

SubscriptionModelSchema.virtual("plan", {
  ref: donationModelSchema,
  localField: "plan_id",
  foreignField: "_id",
  justOne: true,
});

export default models.subscription ||
  model<ISubscription>("subscription", SubscriptionModelSchema);
