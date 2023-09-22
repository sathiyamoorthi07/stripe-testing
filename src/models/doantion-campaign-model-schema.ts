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
import mediaFile from "./media-file";

export interface Ivolunteers {
  user_id: ObjectId;
  member_id: string;
  amount: number;
  payment_via: string;
  paid_at: Date;
  status: string;
}

export interface ISchedule {
  start: Mixed;
  end: Mixed;
}

interface IDonationCampaign extends Document {
  zone_id: ObjectId;
  type: Number;
  title: String;
  currency: String;
  description: String;
  banner_id: ObjectId;
  goal_amount: Mixed;
  recived_amount: number;
  status: string;
  created_at: Date;
  created_by: ObjectId;
  updated_at: Date;
  volunteers: [Ivolunteers];
  schedule: ISchedule;
  is_schedule: boolean;
}

type DoantionCampaignModel = Model<IDonationCampaign>;
const DonationCampaignModelSchema = new Schema<
  IDonationCampaign,
  DoantionCampaignModel
>({
  zone_id: { type: Schema.Types.ObjectId },
  type: { type: Schema.Types.Number },
  banner_id: { type: Schema.Types.ObjectId },
  title: { type: Schema.Types.String },
  currency: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  goal_amount: { type: Schema.Types.Mixed, default: null },
  recived_amount: { type: Schema.Types.Number, default: 0 },
  status: { type: Schema.Types.String, default: "OPEN" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId },
  is_schedule: { type: Schema.Types.Boolean, default: false },
  schedule: {
    start: { type: Schema.Types.Mixed },
    end: { type: Schema.Types.Mixed },
  },
  volunteers: [
    {
      user_id: { type: Schema.Types.ObjectId },
      member_id: { type: Schema.Types.String },
      amount: { type: Schema.Types.Number },
      payment_via: { type: Schema.Types.String },
      paid_at: { type: Schema.Types.Date, default: new Date() },
      status: { type: Schema.Types.String },
    },
  ],
});

DonationCampaignModelSchema.set("toObject", { virtuals: true });
DonationCampaignModelSchema.set("toJSON", { virtuals: true });

DonationCampaignModelSchema.virtual("banner", {
  ref: mediaFile,
  localField: "banner_id",
  foreignField: "_id",
  justOne: true,
});

export default models.donation_campaign ||
  model<IDonationCampaign>("donation_campaign", DonationCampaignModelSchema);
