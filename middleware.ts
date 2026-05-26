import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";

export const customLogger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});

const errorResponse = new Response("Unauthorized", {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
});

export const verifyApiKey = createMiddleware(async (c, next) => {
  const key = c.req.header("x-api-key");
  if (key == undefined || key === "") {
    throw new HTTPException(401, { res: errorResponse });
  }
  await next();
});
