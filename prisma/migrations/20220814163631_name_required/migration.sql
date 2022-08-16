/*
  Warnings:

  - Made the column `name` on table `UserModel` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_UserModel" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "UserModel";
DROP TABLE "UserModel";
ALTER TABLE "new_UserModel" RENAME TO "UserModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
