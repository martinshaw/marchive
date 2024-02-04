import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSourcesTable1706600379383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE source (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "dataProviderIdentifier" TEXT NOT NULL,
    url TEXT NOT NULL,
    name TEXT NULL,
    "currentStartCursorUrl" TEXT NULL,
    "currentEndCursorUrl" TEXT NULL,
    "useStartOrEndCursor" TEXT NULL,
    "sourceDomainId" INTEGER NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "deletedAt" DATE NULL
)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE source`);
  }
}
