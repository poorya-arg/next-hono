// src/types/projectMembers.d.ts
export interface IProjectMember {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProjectMember {
  projectId: string;
  userId: string;
}
