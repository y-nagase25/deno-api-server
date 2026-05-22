import { Hono } from "hono";
import book from "./route/book.ts";

const app = new Hono().basePath("api");

app.get("/", (c) => {
  return c.json({ success: true, message: "hello hono" });
});
app.route("/book", book);

app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ success: false, message: "Something went wrong" }, 500);
});

export default app;
