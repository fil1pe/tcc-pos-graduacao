import { ApiProperty } from '@nestjs/swagger'

export class SingInDto {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string
}
