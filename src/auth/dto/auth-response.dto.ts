import { Expose, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { UserEntity } from 'src/user/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token',
  })
  @Expose()
  @IsString()
  accessToken: string

  @ApiProperty({
    example: 'f3f4a5c9-7d89-4a5d-b5c3-9f6a2f4f3f7b',
    description: 'Refresh token',
  })
  @IsString()
  @Expose()
  refreshToken: string

  @ApiProperty({ type: () => UserEntity })
  @Expose()
  @Type(() => UserEntity)
  user: UserEntity

  constructor({ user = undefined, ...partial }: Partial<AuthResponseDto> = {}) {
    Object.assign(this, partial)

    if (user) {
      this.user = new UserEntity(user)
    }
  }
}
