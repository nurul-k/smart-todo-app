import mongoose, { Schema, Document, Model } from 'mongoose';

export type GoalType = 'MONTHLY' | 'YEARLY' | 'CUSTOM';
export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface IGoal extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Goal title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    type: {
      type: String,
      enum: ['MONTHLY', 'YEARLY', 'CUSTOM'],
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'FAILED'],
      default: 'ACTIVE',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
/* GoalSchema.index({ userId: 1 }); */
GoalSchema.index({ status: 1 });
GoalSchema.index({ startDate: 1, endDate: 1 });

const Goal: Model<IGoal> =
  mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;