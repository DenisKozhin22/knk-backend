import { Prisma } from '@prisma/client'

export const userWithoutPasswordSelect: Prisma.UserSelect = {
  id: true,
  role: true,
  login: true,
  createdAt: true,
  updatedAt: true,
}
