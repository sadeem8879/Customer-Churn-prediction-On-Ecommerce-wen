-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_AccessoriesProduct" TO "Cart_accessoriesProductId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_CosmeticsProduct" TO "Cart_cosmeticsProductId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_KidsProduct" TO "Cart_kidsProductId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_MenProduct" TO "Cart_menProductId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_User" TO "Cart_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "FK_Cart_WomenProduct" TO "Cart_womenProductId_fkey";
