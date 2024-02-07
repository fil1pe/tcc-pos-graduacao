import { OmitType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { encrypt } from 'src/helpers/encrypt.helper'
import { PartialType } from '@nestjs/swagger'

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'encryptPassword',
]) {
  // Encripta senha:
  async encryptPassword() {
    if (this.password) this.password = await encrypt(this.password)
  }
}
