import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCapturePartsTable1706600783575
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE capture_part (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "url" TEXT NOT NULL,
    "dataProviderPartIdentifier" TEXT NOT NULL,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "downloadLocation" TEXT NULL DEFAULT NULL,
    "currentRetryCount" INTEGER NOT NULL DEFAULT 0,
    "deletedFromDownloads" BOOLEAN NOT NULL DEFAULT false,
    "captureId" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "deletedAt" DATE NULL
)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE capture_part`);
  }
}
