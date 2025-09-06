import { Body, Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { z } from 'zod/v4';
import { ZodDataTransformPipe } from '../../shared/data-transform/zod-data-transform.pipe';

const STRONG_PASSWORD_REGEX =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}/;
const loginModel = z.object({
  username: z.string().min(6),
  password: z.string().regex(STRONG_PASSWORD_REGEX),
});
export type LoginDTO = z.infer<typeof loginModel>;
export type LoginResponse = {
  accessToken: string;
};

const registerModel = z.object({
  username: z.string().min(6),
  name: z.string().min(6),
  password: z.string().regex(STRONG_PASSWORD_REGEX),
});
export type RegisterDTO = z.infer<typeof registerModel>;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(ZodDataTransformPipe(loginModel)) loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('renew')
  renew(@Body('refreshToken') refreshToken: string) {
    return this.authService.renew(refreshToken);
  }

  @Post('register')
  register(
    @Body(ZodDataTransformPipe(registerModel)) registerDTO: RegisterDTO,
  ) {
    return this.authService.register(registerDTO);
  }
}
