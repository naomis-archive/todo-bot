import { Document, model, Schema } from "mongoose";

export interface Task extends Document {
  name: string;
  description?: string;
  dueDate: Date;
}

export const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

export const TaskModel = model<Task>("task", TaskSchema);
