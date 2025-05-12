import { IsString, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  login?: string

  @IsString()
  @IsOptional()
  password?: string
}
