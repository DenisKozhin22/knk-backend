import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetaDto {
  static DEFAULT_PAGE_SIZE = 10
  static DEFAULT_PAGE_NUMBER = 1

  @ApiProperty({
    description: 'Общее количество элементов',
    example: 100,
  })
  @Expose()
  total: number

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 10,
  })
  @Expose()
  lastPage: number

  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
  })
  @Expose()
  currentPage: number

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 10,
  })
  @Expose()
  totalPerPage: number

  @ApiProperty({
    description: 'Номер предыдущей страницы, null если это первая страница',
    example: 1,
    nullable: true,
  })
  @Expose()
  prevPage: number | null

  @ApiProperty({
    description: 'Номер следующей страницы, null если это последняя страница',
    example: 2,
    nullable: true,
  })
  @Expose()
  nextPage: number | null

  constructor(
    total: number = 0,
    query: { page?: number; limit?: number } = {},
  ) {
    const limit = Math.abs(query.limit ?? PaginationMetaDto.DEFAULT_PAGE_SIZE)
    const page = Math.abs(query.page ?? PaginationMetaDto.DEFAULT_PAGE_NUMBER)

    const lastPage = Math.ceil(total / limit)

    this.total = total
    this.lastPage = lastPage
    this.currentPage = page
    this.totalPerPage = limit
    this.prevPage = page > 1 ? page - 1 : null
    this.nextPage = page < lastPage ? page + 1 : null
  }
}
