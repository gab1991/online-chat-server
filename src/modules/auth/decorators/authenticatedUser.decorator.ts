import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();

  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
});
