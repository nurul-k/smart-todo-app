export interface Todo {
  _id?: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoFormData {
  title: string;
}
