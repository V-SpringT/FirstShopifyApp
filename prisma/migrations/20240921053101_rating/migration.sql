/*
  Warnings:

  - Added the required column `star` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductId" TEXT NOT NULL,
    "CustomerId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "star" INTEGER NOT NULL
);
INSERT INTO "new_Rating" ("CustomerId", "ProductId", "id", "shop") SELECT "CustomerId", "ProductId", "id", "shop" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating_shop_ProductId_CustomerId_key" ON "Rating"("shop", "ProductId", "CustomerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
