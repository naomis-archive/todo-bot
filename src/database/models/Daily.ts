import { Document, model, Schema } from "mongoose";

export interface Daily extends Document {
  name: string;
  description?: string;
  cron: string;
  streak: number;
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
  streak: {
    type: Number,
    default: 0,
  },
});

export const DailyModel = model<Daily>("daily", DailySchema);
