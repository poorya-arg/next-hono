export interface IStatus {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
}

export interface ICreateStatus {
  title: string;
}
