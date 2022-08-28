import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { hashSync } from 'bcrypt';

export interface UserData extends User {
  _id: any;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  private readonly users = [
    {
      userId: 1,
      username: 'test',
      password: 'test',
    },
    {
      userId: 2,
      username: 'test2',
      password: 'test2',
    },
  ];

  async findOne(username: string): Promise<UserData | undefined> {
    // return this.users.find((user) => user.username === username);
    const doc = await this.userModel.findOne({ username });
    if (!doc) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'User Not Found in the database',
      });
    }
    return {
      _id: doc._id,
      username: doc.username,
      password: doc.password,
    };
  }

  async createUser(user: CreateUserDto) {
    const saltRounds = 10;
    const password = hashSync(user.password, saltRounds);
    const newUser = new this.userModel({
      username: user.username,
      password,
    });
    return await newUser.save();
  }
}
