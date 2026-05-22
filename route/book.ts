import { Hono } from "hono";

const book = new Hono();
book.get("/", (c) => c.text("List Books"));
book.post("/", (c) => c.text("Create Book"));

export default book;
