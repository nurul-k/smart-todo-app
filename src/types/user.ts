export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}
