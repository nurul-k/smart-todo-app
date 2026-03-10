export interface Todo {
  _id?: string;
  title: string;
  completed: boolean;
  userId: string;
  goalId?: string;   // ✅ add this line
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoFormData {
  title: string;
}
