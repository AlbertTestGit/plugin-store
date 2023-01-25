import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.role = createUserDto.role || Role.User;
    user.passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
