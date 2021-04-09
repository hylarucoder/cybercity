import { MiddlewareFn } from "type-graphql";
import { AuthFailed } from "@/errors";
import { calcDepth } from "@/utils/graphql";

const ALLOW_LIST = [
  // query
  "healthCheck",
  // mutation
  "login",
];

export const AuthMiddleware: MiddlewareFn<any> = ({ context, info }, next) => {
  const username: string = context.username || "guest";
  // 定义深度为 2 级节点为路由节点,做 auth 级别的判断
  const depth = calcDepth(info.path);
  if (depth === 2) {
    // TODO: replace with fastify logging
    console.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
    console.log("--->", context.user)
    if (!ALLOW_LIST.includes(<string>info.path.key)) {
      if (!context.user) {
        throw new AuthFailed("未登录");
      }
    }
  }

  return next();
};
