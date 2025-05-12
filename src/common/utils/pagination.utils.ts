// import { Expose, plainToInstance, Type } from 'class-transformer'
// import { IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator'
// import { NotFoundException } from '@nestjs/common'
// import { QueryPaginationDto } from 'src/dtos/query-pagination.dto'

// const DEFAULT_PAGE_NUMBER = 1
// const DEFAULT_PAGE_SIZE = 10

// export class PaginatedResultDto<T> {
//   @Expose()
//   data: T[]
//   @Expose()
//   total: number
//   @Expose()
//   limit: number
//   @Expose()
//   page: number

//   constructor(
//     classType: new (...args: any[]) => T,
//     data: any[],
//     total: number,
//     page: number,
//     limit: number,
//   ) {
//     this.data = data.map(item => new classType(item))
//     this.total = total
//     this.page = page
//     this.limit = limit
//   }
// }

// // Класс для метаданных пагинации
// class PaginateMeta {
//   @Expose()
//   @IsNumber()
//   total: number

//   @Expose()
//   @IsNumber()
//   lastPage: number

//   @Expose()
//   @IsNumber()
//   currentPage: number

//   @Expose()
//   @IsNumber()
//   totalPerPage: number

//   @Expose()
//   @IsOptional()
//   @IsNumber()
//   prevPage: number | null

//   @Expose()
//   @IsOptional()
//   @IsNumber()
//   nextPage: number | null

//   constructor(partial: Partial<PaginateMeta>) {
//     Object.assign(this, partial)
//   }
// }

// // Класс для результата пагинации
// export class PaginateOutput<T> {
//   @Expose()
//   @IsArray()
//   @ValidateNested({ each: true })
//   data: T[]

//   @Expose()
//   @ValidateNested()
//   @Type(() => PaginateMeta)
//   meta: PaginateMeta

//   constructor(partial: Partial<PaginateOutput<T>>) {
//     Object.assign(this, partial)
//   }
// }

// // Функция пагинации
// export const paginate = (
//   query: QueryPaginationDto,
// ): { skip: number; take: number } => {
//   const limit = Math.abs(query.limit) || DEFAULT_PAGE_SIZE
//   const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
//   return {
//     skip: limit * (page - 1),
//     take: limit,
//   }
// }

// // Функция для формирования выходных данных с пагинацией
// export const paginateOutput = <T>(
//   data: T[],
//   total: number,
//   query: QueryPaginationDto,
// ): PaginateOutput<T> => {
//   const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
//   const limit = Math.abs(query.limit) || DEFAULT_PAGE_SIZE

//   const lastPage = Math.ceil(total / limit)

//   if (!data.length) {
//     return new PaginateOutput({
//       data,
//       meta: new PaginateMeta({
//         total,
//         lastPage,
//         currentPage: page,
//         totalPerPage: limit,
//         prevPage: null,
//         nextPage: null,
//       }),
//     })
//   }

//   if (page > lastPage) {
//     throw new NotFoundException(
//       `Страница ${page} не найдена. Последняя страница ${lastPage}`,
//     )
//   }

//   return new PaginateOutput({
//     data,
//     meta: new PaginateMeta({
//       total,
//       lastPage,
//       currentPage: page,
//       totalPerPage: limit,
//       prevPage: page > 1 ? page - 1 : null,
//       nextPage: page < lastPage ? page + 1 : null,
//     }),
//   })
// }
