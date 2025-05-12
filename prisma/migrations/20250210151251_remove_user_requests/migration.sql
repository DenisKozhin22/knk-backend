/*
  Warnings:

  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;
