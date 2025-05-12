import { RequestStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CompleteRequestDto {
  @ApiProperty({
    enum: RequestStatus,
    description: 'Статус запроса. Не может быть IN_PROGRESS или PENDING.',
    enumName: 'RequestStatus',
  })
  @IsEnum(RequestStatus, { message: 'Некорректный статус' })
  status: Exclude<RequestStatus, 'IN_PROGRESS' | 'PENDING'>

  @ApiProperty({
    description: 'Комментарий к запросу, добавляемый при завершении.',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedComment?: string
}
