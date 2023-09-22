import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IMediaFile extends Document {
  file_path: String;
  name: String;
  type: String;
  content_type: String;
  size: Schema.Types.Number;
  info: Schema.Types.Mixed;
  status: String;
  account_id: Schema.Types.ObjectId;
  created_at: Date;
}

type MediaFileModel = Model<IMediaFile>;

const MediaFileModelSchema = new Schema<IMediaFile, MediaFileModel>({
  file_path: { type: Schema.Types.String },
  name: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  content_type: { type: Schema.Types.String },
  size: { type: Schema.Types.Number },
  info: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.String },
  account_id: { type: Schema.Types.ObjectId },
  created_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.media_file ||
  model<IMediaFile>("media_file", MediaFileModelSchema);
