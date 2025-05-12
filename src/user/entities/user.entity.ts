import { Role, User } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserEntity implements User {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  @Expose()
  @IsNumber()
  id: number

  @ApiProperty({ example: 'johndoe', description: 'Логин пользователя' })
  @Expose()
  @IsString()
  login: string

  @ApiProperty({ example: 'John', description: 'Имя пользователя' })
  @Expose()
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Doe', description: 'Фамилия пользователя' })
  @Expose()
  @IsString()
  lastName: string

  @Exclude()
  @IsString()
  password: string

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Роль пользователя',
  })
  @Expose()
  @IsEnum(Role)
  role: Role

  @ApiProperty({
    example: '2024-02-16T12:34:56.789Z',
    description: 'Дата создания пользователя',
  })
  @Expose()
  @IsDate()
  createdAt: Date

  @ApiProperty({
    example: '2024-02-16T12:34:56.789Z',
    description: 'Дата последнего обновления пользователя',
  })
  @Expose()
  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
