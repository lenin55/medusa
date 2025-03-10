import { Migration } from "@mikro-orm/migrations"

export class Migration1720536000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "banner" (
        "id" varchar(255) NOT NULL,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        "deleted_at" timestamp with time zone NULL,
        "name" varchar(255) NOT NULL,
        "image_url" varchar(255) NOT NULL,
        "description" text NULL,
        "is_active" boolean NOT NULL DEFAULT false,
        "link_url" varchar(255) NULL,
        "valid_from" date NULL,
        "valid_until" date NULL,
        
        CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
      );
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE "banner";`)
  }
}