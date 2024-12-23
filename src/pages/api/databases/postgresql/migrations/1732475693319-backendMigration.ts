import { MigrationInterface, QueryRunner } from 'typeorm';
const bcrypt = require('bcrypt');

export class BackendMigration1732475693319 implements MigrationInterface {
  name = 'BackendMigration1732475693319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "radicado" ("id" SERIAL NOT NULL, "numero_radicado" character varying NOT NULL, "titulo" character varying NOT NULL, "responsable" character varying NOT NULL, "fecha" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6d988123d8e7c78d4a782e5541f" UNIQUE ("numero_radicado"), CONSTRAINT "PK_46e9bd5e5dc0cb20c2cf13729ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "name" character varying, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
    );

    // Generar contraseñas hasheadas
    const adminPassword = await bcrypt.hash('Test123@', 10);
    const guestPassword = await bcrypt.hash('Test123@', 10);

    // Insertar usuarios por defecto
    await queryRunner.query(
      `INSERT INTO "user" ("email", "name", "password", "createdAt", "updatedAt")
         VALUES
         ('admin@valor.com', 'Admin', '${adminPassword}', now(), now()),
         ('guest@valor.com', 'Guest', '${guestPassword}', now(), now())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "radicado"`);
  }
}
