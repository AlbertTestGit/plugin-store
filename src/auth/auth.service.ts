import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { PayloadDto } from './dto/payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload: PayloadDto = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
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

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByUsername(username);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user;
    }

    return null;
  }
}
