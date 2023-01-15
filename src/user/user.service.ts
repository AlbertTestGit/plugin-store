import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const candidate = await this.findOneByEmail(createUserDto.email);

    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.passwordHash = await bcrypt.hash(createUserDto.password, 10);

    await this.userRepository.save(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(updateUserDto.id);

    if (user === null) {
      throw new NotFoundException('User is not found');
    }

    if (updateUserDto.email !== undefined) {
      const candidate = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (candidate !== null) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    if (updateUserDto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (user === null) {
      throw new NotFoundException('User is not found');
    }

    await this.userRepository.delete(id);
  }
}
