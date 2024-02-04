import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSourceDomainsTable1706600471177
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE source_domain (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NULL,
    "faviconPath" TEXT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "deletedAt" DATE NULL
)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE source_domain`);
  }
}
