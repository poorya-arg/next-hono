// src/types/comments.d.ts
export interface IComment {
  id: string;
  context: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
}

export interface ICreateComment {
  context: string;
  taskId: string;
}
