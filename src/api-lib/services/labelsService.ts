import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { CreateLabelSchema } from "../validations/labelsValidationSchema";
import { LabelsModel } from "../models/lablesModel";
import { ICreateLabel } from "../types/labelsType";

const createLabelsTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS labels (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      color_code TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      enabled BOOLEAN NOT NULL DEFAULT true,
      deleted BOOLEAN NOT NULL DEFAULT false
    );
  `);
};

async function createLabel(data: ICreateLabel) {
  await createLabelsTableIfNotExist();

  const { error } = CreateLabelSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  const result = await db.insert(LabelsModel).values(data).execute();
  return result;
}

async function getLabels() {
  await createLabelsTableIfNotExist();
  return await db
    .select()
    .from(LabelsModel)
    .where(eq(LabelsModel.deleted, false));
}

async function deleteLabel(labelID: string) {
  const result = await db
    .update(LabelsModel)
    .set({ deleted: true })
    .where(eq(LabelsModel.id, labelID));
  return result.rows;
}

export { getLabels, createLabel, deleteLabel };
