import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmailAndPassword(
        email,
        password,
      )
      const payload = { sub: user.cpf, email: user.email }
      return {
        accessToken: await this.jwtService.signAsync(payload),
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
