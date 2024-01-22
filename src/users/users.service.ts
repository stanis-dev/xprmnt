import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  role: 'bmike' | 'elixir-ceo';
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'bored-mike',
      role: 'bmike',
    },
    {
      id: 2,
      username: 'elixir-ceo',
      role: 'elixir-ceo',
    },
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
