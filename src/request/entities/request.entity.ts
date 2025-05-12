import { Urgency, RequestStatus, Request } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { UserEntity } from 'src/user/entities/user.entity'

export class RequestEntity implements Request {
  @ApiProperty({
    description: 'Уникальный идентификатор запроса',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'Описание запроса',
    example: 'Необходимо решение по проекту',
  })
  @Expose()
  description: string

  @ApiProperty({
    description: 'Срочность запроса',
    enum: Urgency,
    example: Urgency.HIGH, // Пример значения, можно заменить на актуальное
  })
  @Expose()
  urgency: Urgency

  @ApiProperty({
    description: 'Статус запроса',
    enum: RequestStatus,
    example: RequestStatus.PENDING, // Пример значения, можно заменить на актуальное
  })
  @Expose()
  status: RequestStatus

  @ApiProperty({
    description: 'Дата создания запроса',
    example: '2025-02-16T12:00:00Z',
  })
  @Expose()
  createdAt: Date

  @ApiProperty({
    description: 'Дата последнего обновления запроса',
    example: '2025-02-16T12:00:00Z',
  })
  @Expose()
  updatedAt: Date

  @Exclude()
  userId: number

  @Exclude()
  assignedToId: number

  @ApiProperty({
    description: 'Пользователь, создавший запрос',
    type: UserEntity,
    required: false,
  })
  @Expose()
  @IsOptional()
  user?: UserEntity

  @ApiProperty({
    description: 'Пользователь, назначенный на запрос',
    type: UserEntity,
    required: false,
  })
  @Expose()
  @IsOptional()
  assignedTo?: UserEntity

  @ApiProperty({
    description: 'Ответ от админа',
    example: 'Задачу решил',
  })
  @Expose()
  @IsOptional()
  assignedComment: string | null

  constructor({
    user = undefined,
    assignedTo = undefined,
    ...partial
  }: Partial<RequestEntity> = {}) {
    Object.assign(this, partial)

    if (user) {
      this.user = new UserEntity(user)
    }

    if (assignedTo) {
      this.assignedTo = new UserEntity(assignedTo)
    }
  }
}
