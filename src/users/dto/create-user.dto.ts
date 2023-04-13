import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  userPass: string;

  @IsString({ each: true })
  accounts: string[];
}
