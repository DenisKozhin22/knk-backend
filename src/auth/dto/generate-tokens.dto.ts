import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class GenerateTokensDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  role: string
}
