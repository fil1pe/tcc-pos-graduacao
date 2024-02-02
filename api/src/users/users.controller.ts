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
import { EstablishmentsService } from 'src/establishments/establishments.service'
import { InterestsService } from 'src/interests/interests.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly establishmentsService: EstablishmentsService,
    private readonly interestsService: InterestsService,
  ) {}

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

  // Lista todos os estabelecimentos do usuário:
  @UseGuards(AuthGuard)
  @Get('me/establishments')
  findEstablishments(@Request() req) {
    return this.establishmentsService.findAllByAdmin(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Get('me/interests')
  // Busca todos os interesses do usuário:
  findInterests(@Request() req) {
    return this.interestsService.findAll(req.user.sub)
  }
}
