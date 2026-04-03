/*
  Warnings:

  - You are about to drop the column `adress` on the `User` table. All the data in the column will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `zipCode` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL,
DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" INTEGER NOT NULL;
