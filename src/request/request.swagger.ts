import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger'
import { RequestEntity } from './entities/request.entity'
import { PaginationResultDto } from 'src/pagination/dto/pagination-result.dto'
import { RequestStatus } from '@prisma/client'
import { PaginationMetaDto } from 'src/pagination/dto/pagination-meta.dto'

export const ApiCreateRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Создать запрос' }),
    ApiResponse({
      status: 200,
      description: 'Запрос успешно создан.',
      type: RequestEntity,
    }),
    ApiResponse({ status: 400, description: 'Некорректные данные.' }),
  )

export const ApiGetAllRequestsForUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Получить все запросы для текущего пользователя' }),
    ApiQuery({
      name: 'status',
      enum: RequestStatus,
      required: false,
      description: 'Фильтрация по статусу',
    }),
    ApiExtraModels(PaginationMetaDto, RequestEntity),
    ApiResponse({
      status: 200,
      description: 'Список запросов для пользователя.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(RequestEntity) },
          },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  )

export const ApiDeleteRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Удалить запрос' }),
    ApiParam({ name: 'id', type: Number, description: 'ID запроса' }),
    ApiResponse({ status: 204, description: 'Запрос удален.' }),
    ApiResponse({ status: 404, description: 'Запрос не найден.' }),
  )

export const ApiAssignRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Принять запрос (только для администраторов)' }),
    ApiParam({ name: 'id', type: Number, description: 'ID запроса' }),
    ApiResponse({
      status: 200,
      description: 'Запрос принят.',
      type: RequestEntity,
    }),
    ApiResponse({ status: 404, description: 'Запрос не найден.' }),
  )

export const ApiGetAssignedRequests = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить назначенные запросы (только для администраторов)',
    }),
    ApiResponse({ status: 200, description: 'Список назначенных запросов' }),
  )

export const ApiCompleteRequestByAdmin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Завершить запрос администратором' }),
    ApiParam({ name: 'id', type: Number, description: 'ID запроса' }),
    ApiResponse({
      status: 200,
      description: 'Запрос успешно завершен.',
      type: RequestEntity,
    }),
    ApiResponse({ status: 400, description: 'Некорректные данные.' }),
    ApiResponse({ status: 404, description: 'Запрос не найден.' }),
  )

export const ApiGetAllRequestsForAdmin = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Получить все запросы для администратора (только для администраторов)',
    }),
    ApiExtraModels(PaginationMetaDto, RequestEntity),
    ApiQuery({
      name: 'status',
      enum: RequestStatus,
      required: false,
      description: 'Фильтрация по статусу',
    }),
    ApiResponse({
      status: 200,
      description: 'Список запросов для администратора.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(RequestEntity) },
          },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  )
