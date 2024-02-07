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
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // Cadastra usuário:
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Get('me')
  // Busca dados do usuário:
  findMe(@Request() req) {
    return this.usersService.findOne(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  // Altera dados do usuário:
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  // Remove o usuário:
  remove(@Request() req) {
    return this.usersService.remove(req.user.sub)
  }
}
