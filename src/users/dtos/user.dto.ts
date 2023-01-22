import { Expose } from 'class-transformer';
export class UserDTO {
  @Expose()
  id: string;
  @Expose()
  email: string;
}
