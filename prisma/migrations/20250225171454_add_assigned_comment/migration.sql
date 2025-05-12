-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "assigned_comment" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "first_name" DROP DEFAULT,
ALTER COLUMN "last_name" DROP DEFAULT;
