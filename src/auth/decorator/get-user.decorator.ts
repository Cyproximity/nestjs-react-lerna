import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    // return key-value
    if (data && data in user) return user[data];
    // returns user-obj
    return user;
  },
);
