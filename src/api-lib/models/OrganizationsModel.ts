import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

const OrganizationsModel = pgTable("organizations", {
  id: uuid("id").default("uuid_generate_v4").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
  ownerEmail: varchar("owner_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export { OrganizationsModel };
