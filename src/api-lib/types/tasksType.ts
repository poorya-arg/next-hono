export interface ITask {
  id: string;
  title: string;
  description: string;
  statusId: string;
  labelId: string;
  assigneeId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
}

export interface ICreateTask {
  title: string;
  description: string;
  statusId: string;
  labelId: string;
  assigneeId: string;
  organizationId: string;
}

export interface IAssignTask {
  taskId: string;
  userId: string;
}
