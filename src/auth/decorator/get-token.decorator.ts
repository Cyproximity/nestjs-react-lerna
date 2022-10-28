import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // return key-value
    // if (data && data in user) return user[data];
    // returns user-obj
    console.log(req)
    return "hello";
  },
);
