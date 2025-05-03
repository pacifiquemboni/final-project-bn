import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'pacifiquemboni@gmail.com', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'Test@123!', description: 'The password of the user' })
  password: string;
}
