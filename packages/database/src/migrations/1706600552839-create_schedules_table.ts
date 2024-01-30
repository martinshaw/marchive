import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchedulesTable1706600552839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // typeorm syntax
    await queryRunner.query(`
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending', 
    interval INTEGER NULL,
    "lastRunAt" DATE NULL DEFAULT null,
    "nextRunAt" DATE NULL DEFAULT null,
    "downloadLocation" TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    "deletedFromDownloads" BOOLEAN NOT NULL DEFAULT false,
    "sourceId" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "deletedAt" DATE NULL
)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE schedule`);
  }
}
