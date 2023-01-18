import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
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
  async getAll() {
    const users = await this.userService.findAll();
    users.map((user) => delete user.passwordHash);

    return users;
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    delete user.passwordHash;
    return user;
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOneById(updateUserDto.id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const updatedUser = await this.userService.update(user, updateUserDto);
    delete updatedUser.passwordHash;
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return await this.userService.remove(id);
  }
}
