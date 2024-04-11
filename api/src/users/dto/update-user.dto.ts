import { OmitType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { encrypt } from 'src/helpers/encrypt.helper'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'encryptPassword',
]) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Digite sua senha atual' })
  currentPassword: string

  // Encripta senha:
  async encryptPasswords() {
    await Promise.all([
      async () => {
        this.password = await encrypt(this.password)
      },
      async () => {
        this.currentPassword = await encrypt(this.currentPassword)
      },
    ])
  }
}
