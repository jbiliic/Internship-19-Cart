/*
  Warnings:

  - The primary key for the `OrderProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OrderProduct" DROP CONSTRAINT "OrderProduct_pkey",
ADD CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("orderId", "productId", "selectedSize");
