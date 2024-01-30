import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCapturesTable1706600657091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE capture (
    id SERIAL PRIMARY KEY,
    "downloadLocation" TEXT NOT NULL,
    "allowedRetriesCount" INTEGER NOT NULL DEFAULT 3,
    "deletedFromDownloads" BOOLEAN NOT NULL DEFAULT false,
    "scheduleId" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "deletedAt" DATE NULL
)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE capture`);
  }
}
