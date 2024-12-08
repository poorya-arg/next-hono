import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { OrganizationsModel } from "../models/OrganizationsModel";
import { OrganizationValidationSchema } from "../validations";

const createOrgTableIfNotExist = async () => {
  await db.execute(sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        owner_email VARCHAR NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
};

async function getOrganization() {
  try {
    await createOrgTableIfNotExist();
    const result = db.select().from(OrganizationsModel);
    return result;
  } catch (error) {
    console.log(error);

    throw error;
  }
}

async function createOrganization(organizationData: ICreateOrganization) {
  try {
    const error =
      OrganizationValidationSchema.createSchema.validate(
        organizationData
      ).error;
    if (error) {
      throw Error(
        "Invalid input" +
          error?.details.map((details) => details.message).join(", ")
      );
    }
    const result = await db
      .insert(OrganizationsModel)
      .values(organizationData)
      .execute();
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export { getOrganization, createOrganization };
