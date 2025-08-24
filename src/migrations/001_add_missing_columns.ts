import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumns1703000001000 implements MigrationInterface {
  name = 'AddMissingColumns1703000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types if they don't exist
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'superadmin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE biodata_status_enum AS ENUM ('Pending', 'Active', 'Inactive', 'Rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add mobile column to user table if it doesn't exist
    await queryRunner.query(`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "mobile" character varying(15);
    `);

    // Update role column to use enum type if it's not already
    const roleColumnType = await queryRunner.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' AND column_name = 'role';
    `);

    if (roleColumnType[0]?.data_type === 'character varying') {
      // Update existing role values to match enum
      await queryRunner.query(`
        UPDATE "user" SET "role" = 'superadmin' WHERE "role" = 'super_admin' OR "role" = 'Super Admin';
      `);
      
      // Remove default, change type, then add default back
      await queryRunner.query(`
        ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
      `);
      
      await queryRunner.query(`
        ALTER TABLE "user" 
        ALTER COLUMN "role" TYPE user_role_enum USING "role"::user_role_enum;
      `);
      
      await queryRunner.query(`
        ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'::user_role_enum;
      `);
    }

    // Check if biodata table exists and update status column
    const biodataExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'biodata'
      );
    `);

    if (biodataExists[0]?.exists) {
      const statusColumnType = await queryRunner.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'biodata' AND column_name = 'status';
      `);

      if (statusColumnType[0]?.data_type === 'character varying') {
        // Update existing status values
        await queryRunner.query(`
          UPDATE "biodata" SET "status" = 'Pending' WHERE "status" IS NULL OR "status" = '' OR "status" = 'pending';
          UPDATE "biodata" SET "status" = 'Active' WHERE "status" = 'active';
          UPDATE "biodata" SET "status" = 'Inactive' WHERE "status" = 'inactive';
          UPDATE "biodata" SET "status" = 'Rejected' WHERE "status" = 'rejected';
        `);

        // Remove default, change type, then add default back
        await queryRunner.query(`
          ALTER TABLE "biodata" ALTER COLUMN "status" DROP DEFAULT;
        `);
        
        await queryRunner.query(`
          ALTER TABLE "biodata" 
          ALTER COLUMN "status" TYPE biodata_status_enum USING "status"::biodata_status_enum;
        `);
        
        await queryRunner.query(`
          ALTER TABLE "biodata" ALTER COLUMN "status" SET DEFAULT 'Pending'::biodata_status_enum;
        `);
      }
    }

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" ("email")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_mobile" ON "user" ("mobile") WHERE "mobile" IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_username" ON "user" ("username") WHERE "username" IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_google_id" ON "user" ("googleId") WHERE "googleId" IS NOT NULL`);

    // Create unique constraints
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_mobile" ON "user" ("mobile") WHERE "mobile" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_username" ON "user" ("username") WHERE "username" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_google_id" ON "user" ("googleId") WHERE "googleId" IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_google_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_username"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_mobile"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_google_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_username"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_mobile"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_email"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "mobile"`);
  }
}