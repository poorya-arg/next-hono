export interface ILabel {
  id: string;
  title: string;
  colorCode: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
}

export interface ICreateLabel {
  title: string;
  colorCode: string;
}
