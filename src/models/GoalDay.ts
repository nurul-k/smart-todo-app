import mongoose, { Schema, Document } from 'mongoose';

export type DayStatus = 'productive' | 'neutral' | 'wasted';

export interface IGoalDay extends Document {
  goalId: string;
  userId: string;
  date: Date;
  status: DayStatus;
}

const GoalDaySchema = new Schema<IGoalDay>(
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
    status: {
      type: String,
      enum: ['productive', 'neutral', 'wasted'],
      required: true,
    },
  },
  { timestamps: true }
);

GoalDaySchema.index({ goalId: 1, date: 1 }, { unique: true });

export default mongoose.models.GoalDay ||
  mongoose.model<IGoalDay>('GoalDay', GoalDaySchema);