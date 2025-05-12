import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetaDto } from './pagination-meta.dto'

export class PaginationResultDto<T> {
  static DEFAULT_PAGE_SIZE = 10
  static DEFAULT_PAGE_NUMBER = 1

  @ApiProperty({
    description: 'Массив данных на текущей странице',
    type: [Object],
  })
  @Type(() => Object)
  @Expose()
  data: T[]

  @ApiProperty({
    description:
      'Метаданные пагинации, включая информацию о страницах и общем количестве элементов',
    type: PaginationMetaDto,
  })
  @Expose()
  meta: PaginationMetaDto

  constructor(
    data: T[],
    total: number,
    query: { page?: number; limit?: number } = {},
  ) {
    this.data = data
    this.meta = new PaginationMetaDto(total, query)
  }
}
