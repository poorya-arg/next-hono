import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import {
  AssignTaskSchema,
  CreateTaskSchema,
} from "../validations/tasksValidationSchema";
import { TasksModel } from "../models/tasksModels";
import { IAssignTask, ICreateTask, ITask } from "../types/tasksType";
import { UsersModel } from "../models/usersModel";

const createTasksTableIfNotExist = async () => {
  await db.execute(sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status_id UUID NOT NULL,
          label_id UUID NOT NULL,
          assignee_id UUID,
          organization_id UUID NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          enabled BOOLEAN NOT NULL DEFAULT true,
          deleted BOOLEAN NOT NULL DEFAULT false,
          CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES status(id),
          CONSTRAINT fk_label_id FOREIGN KEY (label_id) REFERENCES labels(id),
          CONSTRAINT fk_assignee_id FOREIGN KEY (assignee_id) REFERENCES users(id),
          CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id)
        );
      `);
};

async function createTask(data: ICreateTask) {
  await createTasksTableIfNotExist();

  const { error } = CreateTaskSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  const result = await db.insert(TasksModel).values(data).execute();
  return result;
}

async function getTasks() {
  await createTasksTableIfNotExist();
  return await db
    .select()
    .from(TasksModel)
    .where(eq(TasksModel.deleted, false));
}
// New Function: Assign Task to User
async function assignTaskToUser(data: IAssignTask): Promise<ITask> {
  try {
    // Validate input
    const { error } = AssignTaskSchema.validate({
      userId: data.userId,
    });
    if (error) {
      throw new Error(
        "Invalid input: " + error.details.map((d) => d.message).join(", ")
      );
    }

    const { taskId, userId } = data;

    // Check if the task exists and is not deleted
    const task = await db
      .select()
      .from(TasksModel)
      .where(eq(TasksModel.id, taskId))
      .execute();

    if (task.length === 0) {
      throw new Error("Task not found.");
    }

    // Check if the user exists and is not deleted
    const user = await db
      .select()
      .from(UsersModel)
      .where(eq(UsersModel.id, userId))
      .execute();

    if (user.length === 0) {
      throw new Error("User not found.");
    }

    // Assign the task to the user
    const result = await db
      .update(TasksModel)
      .set({ assigneeId: userId })
      .where(eq(TasksModel.id, taskId))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error("Failed to assign task to user.");
    }

    //   @ts-ignore
    return result[0] as ITask;
  } catch (error) {
    console.log(error);

    throw error;
  }
}

async function deleteTask(taskID: string) {
  const result = await db
    .update(TasksModel)
    .set({ deleted: true })
    .where(eq(TasksModel.id, taskID));
  return result.rows;
}

export { createTask, getTasks, deleteTask, assignTaskToUser };
