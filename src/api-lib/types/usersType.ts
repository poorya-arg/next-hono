// src/types/users.d.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
  password: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}
