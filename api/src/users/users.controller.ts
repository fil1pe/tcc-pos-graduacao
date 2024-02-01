import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto) // cadastra usuário
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@Request() req) {
    return this.usersService.findOne(req.user.sub) // retorna dados do usuário logado
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto) // altera dados do usuário logado
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  remove(@Request() req) {
    return this.usersService.remove(req.user.sub) // remove o usuário logado
  }
}
