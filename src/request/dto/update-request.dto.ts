import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Urgency, RequestStatus } from '@prisma/client'

export class UpdateRequestDto {
  @ApiProperty({
    description: 'Описание запроса',
    example: 'Обновленное описание запроса',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Срочность запроса',
    enum: Urgency,
    example: Urgency.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(Urgency)
  urgency?: Urgency

  @ApiProperty({
    description: 'Статус запроса',
    enum: RequestStatus,
    example: RequestStatus.PENDING, // Пример значения, выберите актуальное
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus
}
