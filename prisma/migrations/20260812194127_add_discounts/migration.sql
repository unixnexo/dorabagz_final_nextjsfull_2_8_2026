-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');

-- CreateTable
CREATE TABLE "DiscountGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountGroupProduct" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "DiscountGroupProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountGroupCategory" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "DiscountGroupCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscountGroup_isDeleted_idx" ON "DiscountGroup"("isDeleted");

-- CreateIndex
CREATE INDEX "DiscountGroupProduct_groupId_idx" ON "DiscountGroupProduct"("groupId");

-- CreateIndex
CREATE INDEX "DiscountGroupProduct_productId_idx" ON "DiscountGroupProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountGroupProduct_groupId_productId_key" ON "DiscountGroupProduct"("groupId", "productId");

-- CreateIndex
CREATE INDEX "DiscountGroupCategory_groupId_idx" ON "DiscountGroupCategory"("groupId");

-- CreateIndex
CREATE INDEX "DiscountGroupCategory_categoryId_idx" ON "DiscountGroupCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountGroupCategory_groupId_categoryId_key" ON "DiscountGroupCategory"("groupId", "categoryId");

-- AddForeignKey
ALTER TABLE "DiscountGroupProduct" ADD CONSTRAINT "DiscountGroupProduct_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "DiscountGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountGroupProduct" ADD CONSTRAINT "DiscountGroupProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountGroupCategory" ADD CONSTRAINT "DiscountGroupCategory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "DiscountGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountGroupCategory" ADD CONSTRAINT "DiscountGroupCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
