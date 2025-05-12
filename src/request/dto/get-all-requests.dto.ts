import { IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RequestStatus, Urgency } from '@prisma/client'
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto'

export class GetAllRequestsDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Фильтр по статусу запроса',
    enum: RequestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus

  @ApiProperty({
    description: 'Фильтр по срочности запроса',
    enum: Urgency,
    required: false,
  })
  @IsOptional()
  @IsEnum(Urgency)
  urgency?: Urgency
}
