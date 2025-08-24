import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1703000001000 implements MigrationInterface {
  name = 'InitialSchema1703000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'superadmin');
    `);

    await queryRunner.query(`
      CREATE TYPE biodata_approval_status_enum AS ENUM ('pending', 'approved', 'rejected');
    `);

    await queryRunner.query(`
      CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');
    `);

    // Create user table
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "fullName" character varying,
        "email" character varying NOT NULL,
        "password" character varying,
        "mobile" character varying(15),
        "googleId" character varying,
        "profilePicture" character varying,
        "role" user_role_enum NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_email" UNIQUE ("email")
      );
    `);

    // Create biodata table
    await queryRunner.query(`
      CREATE TABLE "biodata" (
        "id" SERIAL NOT NULL,
        "step" integer NOT NULL DEFAULT 1,
        "userId" integer,
        "completedSteps" text,
        "partnerAgeMin" integer,
        "partnerAgeMax" integer,
        "sameAsPermanent" boolean DEFAULT false,
        "religion" character varying,
        "biodataType" character varying,
        "maritalStatus" character varying,
        "dateOfBirth" character varying,
        "age" integer,
        "height" character varying,
        "weight" integer,
        "complexion" character varying,
        "profession" character varying,
        "bloodGroup" character varying,
        "permanentCountry" character varying,
        "permanentDivision" character varying,
        "permanentZilla" character varying,
        "permanentUpazilla" character varying,
        "permanentArea" character varying,
        "presentCountry" character varying,
        "presentDivision" character varying,
        "presentZilla" character varying,
        "presentUpazilla" character varying,
        "presentArea" character varying,
        "healthIssues" character varying,
        "educationMedium" character varying,
        "highestEducation" character varying,
        "instituteName" character varying,
        "subject" character varying,
        "passingYear" integer,
        "result" character varying,
        "economicCondition" character varying,
        "fatherName" character varying,
        "fatherProfession" character varying,
        "fatherAlive" character varying,
        "motherName" character varying,
        "motherProfession" character varying,
        "motherAlive" character varying,
        "brothersCount" integer,
        "sistersCount" integer,
        "familyDetails" character varying,
        "partnerComplexion" character varying,
        "partnerHeight" character varying,
        "partnerEducation" character varying,
        "partnerProfession" character varying,
        "partnerLocation" character varying,
        "partnerDetails" character varying,
        "fullName" character varying,
        "profilePicture" character varying,
        "email" character varying,
        "guardianMobile" character varying,
        "ownMobile" character varying,
        "biodataApprovalStatus" biodata_approval_status_enum NOT NULL DEFAULT 'pending',
        "biodataVisibilityStatus" biodata_visibility_status_enum NOT NULL DEFAULT 'active',
        "viewCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_biodata_id" PRIMARY KEY ("id")
      );
    `);

    // Create favorites table
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" SERIAL NOT NULL,
        "userId" integer,
        "biodataId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id")
      );
    `);

    // Create profile_views table
    await queryRunner.query(`
      CREATE TABLE "profile_views" (
        "id" SERIAL NOT NULL,
        "biodataId" integer NOT NULL,
        "viewerId" integer,
        "ipAddress" character varying,
        "userAgent" character varying,
        "viewedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_profile_views_id" PRIMARY KEY ("id")
      );
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "biodata" 
      ADD CONSTRAINT "FK_biodata_user" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "favorites" 
      ADD CONSTRAINT "FK_favorites_user" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "favorites" 
      ADD CONSTRAINT "FK_favorites_biodata" 
      FOREIGN KEY ("biodataId") REFERENCES "biodata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "profile_views" 
      ADD CONSTRAINT "FK_profile_views_biodata" 
      FOREIGN KEY ("biodataId") REFERENCES "biodata"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "profile_views" 
      ADD CONSTRAINT "FK_profile_views_user" 
      FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_user_email" ON "user" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_mobile" ON "user" ("mobile") WHERE "mobile" IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_user_google_id" ON "user" ("googleId") WHERE "googleId" IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_biodata_user" ON "biodata" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_biodata_approval_status" ON "biodata" ("biodataApprovalStatus")`);
    await queryRunner.query(`CREATE INDEX "IDX_biodata_visibility_status" ON "biodata" ("biodataVisibilityStatus")`);
    await queryRunner.query(`CREATE INDEX "IDX_favorites_user" ON "favorites" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_favorites_biodata" ON "favorites" ("biodataId")`);
    await queryRunner.query(`CREATE INDEX "IDX_profile_views_biodata" ON "profile_views" ("biodataId")`);
    await queryRunner.query(`CREATE INDEX "IDX_profile_views_viewer" ON "profile_views" ("viewerId")`);

    // Create unique constraints
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_mobile" ON "user" ("mobile") WHERE "mobile" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_google_id" ON "user" ("googleId") WHERE "googleId" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_favorites_user_biodata" ON "favorites" ("userId", "biodataId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE "profile_views"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "biodata"`);
    await queryRunner.query(`DROP TABLE "user"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "biodata_visibility_status_enum"`);
    await queryRunner.query(`DROP TYPE "biodata_approval_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}