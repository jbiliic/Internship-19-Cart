/*
  Warnings:

  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE_SIZE');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "size" "Size"[];
