import { Document, model, Schema } from "mongoose";

export interface Daily extends Document {
  name: string;
  description?: string;
  cron: string;
}

export const DailySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  cron: {
    type: String,
    required: true,
  },
});

export const DailyModel = model<Daily>("daily", DailySchema);
