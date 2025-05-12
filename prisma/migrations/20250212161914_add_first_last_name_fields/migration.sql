-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "assigned_to_id" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" TEXT NOT NULL DEFAULT 'Вася',
ADD COLUMN     "last_name" TEXT NOT NULL DEFAULT 'Пупкин';

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
