import { CreateUserDto } from './create-user.dto'
import { encrypt } from 'src/helpers/encrypt.helper'
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'encryptPassword',
]) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Digite sua senha atual' })
  currentPassword: string

  // Encripta senha:
  async encryptPassword() {
    this.password = await encrypt(this.password)
  }
}
