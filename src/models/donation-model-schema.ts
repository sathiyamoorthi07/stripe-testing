import { Document, Model, Schema, model, models, Types, Mixed } from "mongoose";

interface IDonation extends Document {
  zone_id: Schema.Types.ObjectId;
  type: string;
  currency: string;
  amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  product_id: string;
  price_id: string;
}

type DonationModel = Model<IDonation>;

const DonationModelSchema = new Schema<IDonation, DonationModel>({
  zone_id: { type: Schema.Types.ObjectId },
  type: { type: Schema.Types.String },
  currency: { type: Schema.Types.String },
  amount: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLE" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  product_id: { type: Schema.Types.String },
  price_id: { type: Schema.Types.String },
});

export default models.donation || model("donation", DonationModelSchema);
