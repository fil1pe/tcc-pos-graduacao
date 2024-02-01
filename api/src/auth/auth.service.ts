import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Login:
  async signIn(email: string, password: string) {
    try {
      const userData = await this.usersService.findOneByEmailAndPassword(
        email,
        password,
      )
      const payload = { sub: userData.cpf, email: userData.email }
      return {
        accessToken: await this.jwtService.signAsync(payload),
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
