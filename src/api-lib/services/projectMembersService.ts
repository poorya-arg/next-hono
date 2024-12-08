// src/services/ProjectMembersService.ts
import { db } from "../db";
import { ProjectMembersModel } from "../models/ProjectMembersModel";
import { CreateProjectMemberSchema } from "../validations/ProjectMembersValidation";
import { ICreateProjectMember } from "../types/projectMembers";

export const ProjectMembersService = {
  async createProjectMember(data: ICreateProjectMember) {
    const { error } = CreateProjectMemberSchema.validate(data);
    if (error) {
      throw new Error(
        "Invalid input: " + error.details.map((d) => d.message).join(", ")
      );
    }
    const result = await db
      .insert(ProjectMembersModel)
      .values(data)
      .returning("*");
    return result;
  },

  async getProjectMembers() {
    return await db.select().from(ProjectMembersModel);
  },
};
