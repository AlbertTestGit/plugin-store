import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { PayloadDto } from './dto/payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';

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
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async register(registerDto: RegisterDto) {
    const candidate = await this.userService.findOneByUsername(
      registerDto.username,
    );

    if (candidate) {
      throw new BadRequestException('This username is already taken');
    }

    const createUserDto = new CreateUserDto();
    createUserDto.username = registerDto.username;
    createUserDto.password = registerDto.password;

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
