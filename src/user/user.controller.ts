import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './entities/role.enum';
import { PayloadDto } from '../auth/dto/payload.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const candidate = await this.userService.findOneByUsername(
      createUserDto.username,
    );

    if (candidate) {
      throw new BadRequestException('This username is already taken');
    }

    const user = await this.userService.create(createUserDto);
    delete user.passwordHash;
    return user;
  }

  @Get()
  async getAll(@Request() req) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.role != Role.Manager && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const users = await this.userService.findAll();
    users.map((user) => delete user.passwordHash);

    return users;
  }

  @Get(':id')
  async getOne(
    @Request() req,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.sub != id && jwtUser.role != Role.Manager && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    delete user.passwordHash;
    return user;
  }

  @Put()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.sub != updateUserDto.id && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const user = await this.userService.findOneById(updateUserDto.id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const updatedUser = await this.userService.update(user, updateUserDto);
    delete updatedUser.passwordHash;
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const jwtUser: PayloadDto = req.user;

    if (jwtUser.sub != id && jwtUser.role != Role.Admin) {
      throw new ForbiddenException();
    }

    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return await this.userService.remove(id);
  }
}
