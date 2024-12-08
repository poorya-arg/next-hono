import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { StatusModel } from "../models/statusModel";
import { CreateStatusSchema } from "../validations/statusValidationSchema";
import { ICreateStatus } from "../types/statusType";

const createStatusTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS status (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      enabled BOOLEAN NOT NULL DEFAULT true,
      deleted BOOLEAN NOT NULL DEFAULT false
    );
  `);
};

async function createStatus(data: ICreateStatus) {
  await createStatusTableIfNotExist();

  const { error } = CreateStatusSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  const result = await db.insert(StatusModel).values(data).execute();
  return result;
}

async function getStatusList() {
  await createStatusTableIfNotExist();
  return await db
    .select()
    .from(StatusModel)
    .where(eq(StatusModel.deleted, false));
}

async function deleteStatus(statusID: string) {
  const result = await db
    .update(StatusModel)
    .set({ deleted: true })
    .where(eq(StatusModel.id, statusID));
  return result.rows;
}

export { getStatusList, createStatus, deleteStatus };
