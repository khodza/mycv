import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  //@InjectRepository is only needed because DI is not deal good with generic types
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('You are not logged in');
    }
    return this.repo.findOneBy({ id });
  }
  find(email: string) {
    return this.repo.find({ where: { email } });
  }
  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async remove(id) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return this.repo.remove(user);
  }
}
