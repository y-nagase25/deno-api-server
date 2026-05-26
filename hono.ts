import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { verifyApiKey } from "./middleware.ts";
import supabase from "./lib/supabase.ts";
import { createBookController } from "./controller/bookController.ts";
import { BookService } from "./service/BookService.ts";
import { BookSbRepository } from "./repository/BookSbRepository.ts";

const app = new Hono().basePath("api");

app.use(poweredBy({ serverName: "Deno Deploy" }))
  .use(logger())
  .use(verifyApiKey);

app.get("/", (c) => {
  return c.json({ success: true, message: "hello hono" });
});

// const kv = await Deno.openKv();
// const bookRepository = new BookKvRepository(kv);
const bookRepository = new BookSbRepository(supabase);

const bookService = new BookService(bookRepository);
const bookController = createBookController(bookService);
app.route("/books", bookController);

app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default app;
