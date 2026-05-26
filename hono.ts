import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import book from "./route/book.ts";
import { verifyApiKey } from "./middleware.ts";

const schema = z.object({
  id: z.string(),
  password: z.string(),
});

const app = new Hono().basePath("api");

app.use(poweredBy({ serverName: "Deno Deploy" }))
  .use(logger())
  .use(verifyApiKey);

app.get("/", (c) => {
  return c.json({ success: true, message: "hello hono" });
});
app.post(
  "login",
  zValidator("json", schema),
  (c) => {
    return c.json({ success: true, message: "login success" });
  },
);
app.route("/book", book);

app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default app;
