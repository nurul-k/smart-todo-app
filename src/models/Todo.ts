import mongoose, { Schema, Document } from 'mongoose';
import { Todo } from '@/types/todo';

const TodoSchema = new Schema<Todo & Document>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a todo title'],
      trim: true,
      maxlength: [100, 'Todo title cannot be more than 100 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: [true, 'Todo must be associated with a user'],
      index: true,
    },
    goalId: {
    type: String,
    required: false,
    index: true,
  },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Todo || mongoose.model<Todo & Document>('Todo', TodoSchema);
