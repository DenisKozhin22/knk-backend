import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Логин пользователя',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  login: string

  @ApiProperty({
    example: 'securePassword123',
    description: 'Пароль пользователя',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
