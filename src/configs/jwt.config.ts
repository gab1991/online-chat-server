import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => {
  return {
    secret: process.env.TOKEN_SECRET,
    signOptions: {
      expiresIn: process.env.TOKEN_EXPIRE,
    },
  };
};
