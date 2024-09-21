-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AvgRating" (
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "avgStar" REAL NOT NULL DEFAULT 0,
    "reviewTotal" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_AvgRating" ("avgStar", "productId", "shop") SELECT "avgStar", "productId", "shop" FROM "AvgRating";
DROP TABLE "AvgRating";
ALTER TABLE "new_AvgRating" RENAME TO "AvgRating";
CREATE UNIQUE INDEX "AvgRating_shop_productId_key" ON "AvgRating"("shop", "productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
