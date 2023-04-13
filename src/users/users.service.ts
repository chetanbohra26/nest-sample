import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  private readonly users: User[] = [
    {
      userId: 1,
      userName: 'chetan',
      userPass: 'chetan123',
      accounts: ['facebook', 'gmail'],
    },
    {
      userId: 4,
      userName: 'dark',
      userPass: 'dark123',
      accounts: ['linkedin', 'instagram'],
    },
  ];

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    /* const user = this.users.find((user) => user.userId === +id);
    if (!user) throw new NotFoundException('User not found');
    return user; */
    const user = await this.usersRepository.findOne({ where: { userId: +id } });

    if (!user) throw new NotFoundException(`User with userId #${id} not found`);

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    /* const userId = (this.users[this.users.length - 1]?.userId || 0) + 1;
    const newUser = { userId, ...createUserDto };
    this.users.push(newUser);
    return newUser; */
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  async removeUser(id: number) {
    const removed = await this.usersRepository.delete(+id);
    return removed;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    console.log(id, updateUserDto);
    const user = await this.usersRepository.preload({
      userId: +id,
      ...updateUserDto,
    });

    console.log(user);

    if (!user) throw new NotFoundException(`User with userId #${id} not found`);

    return this.usersRepository.save(user);
  }
}
