import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Urgency } from '@prisma/client'

export class RequestCreateDto {
  @ApiProperty({
    description: 'Описание запроса',
    example: 'Необходимо срочное решение по проекту',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    description: 'Срочность запроса',
    enum: Urgency,
    example: Urgency.HIGH,
  })
  @IsEnum(Urgency)
  @IsNotEmpty()
  urgency: Urgency
}
