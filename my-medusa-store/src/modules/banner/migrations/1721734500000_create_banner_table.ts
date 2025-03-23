import { Migration } from "@mikro-orm/migrations"

export class Migration1721734500000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "banner" (
        "id" varchar(255) PRIMARY KEY,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "name" text NOT NULL,
        "image_url" text NOT NULL,
        "description" text NULL,
        "is_active" boolean NOT NULL DEFAULT false,
        "link_url" text NULL,
        "valid_from" text NULL,
        "valid_until" text NULL,
        "priority" numeric NOT NULL DEFAULT 0,
        "placement" text NOT NULL DEFAULT 'homepage_top'
      );
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "banner";`)
  }
}