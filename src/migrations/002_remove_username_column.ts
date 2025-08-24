import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsernameColumn1703000002000 implements MigrationInterface {
  name = 'RemoveUsernameColumn1703000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint first
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_username"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_username"`);
    
    // Remove the username column
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add the username column back
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "username" character varying`);
    
    // Recreate indexes
    await queryRunner.query(`CREATE INDEX "IDX_user_username" ON "user" ("username") WHERE "username" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_username" ON "user" ("username") WHERE "username" IS NOT NULL`);
  }
}