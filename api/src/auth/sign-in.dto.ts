import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SingInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Digite seu e-mail' })
  email: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Digite sua senha' })
  password: string
}
