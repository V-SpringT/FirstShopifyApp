-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductId" TEXT NOT NULL,
    "CustomerId" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AvgRating" (
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "avgStar" REAL NOT NULL DEFAULT 5
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_shop_ProductId_CustomerId_key" ON "Rating"("shop", "ProductId", "CustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "AvgRating_shop_productId_key" ON "AvgRating"("shop", "productId");
