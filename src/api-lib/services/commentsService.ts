// src/services/CommentsService.ts
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { ICreateComment } from "../types/commentsType";
import { CreateCommentSchema } from "../validations/commentsValidationSchema";
import { CommentsModel } from "../models/commentsModel";

const createCommentsTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      context TEXT NOT NULL,
      task_id UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      enabled BOOLEAN NOT NULL DEFAULT true,
      deleted BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT fk_task
        FOREIGN KEY(task_id)
          REFERENCES tasks(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
    );
  `);
};

async function createComment(data: ICreateComment) {
  await createCommentsTableIfNotExist();
  const { error } = CreateCommentSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }
  const result = await db.insert(CommentsModel).values(data).execute();
  return result;
}

async function getComments() {
  try {
    return await db
      .select()
      .from(CommentsModel)
      .where(eq(CommentsModel.deleted, false));
  } catch (error) {
    console.log(error, "ERROR");
    throw new Error("Failed to fetch comments.");
  }
}

async function deleteComment(commentID: string) {
  try {
    const result = await db
      .update(CommentsModel)
      .set({ deleted: true })
      .where(eq(CommentsModel.id, commentID));
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export { getComments, createComment, deleteComment };
