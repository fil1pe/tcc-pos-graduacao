import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmailAndPassword(
        email,
        password,
      )
      return user
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}
