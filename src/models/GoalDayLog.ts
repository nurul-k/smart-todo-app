import mongoose, { Schema, Document, Model } from "mongoose";

export type DayCategory = "productive" | "neutral" | "wasted" | "vacation";

export interface IGoalDayLog extends Document {
  goalId: string;
  userId: string;
  date: Date;
  category: DayCategory;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalDayLogSchema = new Schema<IGoalDayLog>(
  {
    goalId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["productive", "neutral", "wasted", "vacation"],
      required: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

/*
Prevent duplicate entries for the same day
Example:
Goal A
2026-03-07

only one record allowed
*/
GoalDayLogSchema.index({ goalId: 1, date: 1 }, { unique: true });

const GoalDayLog: Model<IGoalDayLog> =
  mongoose.models.GoalDayLog ||
  mongoose.model<IGoalDayLog>("GoalDayLog", GoalDayLogSchema);

export default GoalDayLog;