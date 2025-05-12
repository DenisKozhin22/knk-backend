import { Transform } from 'class-transformer'
import { IsInt, IsPositive, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Номер страницы',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsInt()
  @IsPositive()
  page?: number

  @ApiProperty({
    description: 'Лимит элементов на странице',
    required: false,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  @IsInt()
  @IsPositive()
  limit?: number
}
