import { Hono } from "hono";
import { BookService } from "../service/bookService.ts";
import { zValidator } from "@hono/zod-validator";
import { Book, CreateBookSchema, UpdateBookSchema } from "../model/book.ts";
import { ApiResponse } from "../shared/types.ts";

export function createBookController(service: BookService): Hono {
  const app = new Hono();

  app.get("/", async (c) => {
    const books = await service.listBooks();
    return c.json<ApiResponse<Book[]>>({ success: true, data: books });
  });

  app.get("/:id", async (c) => {
    try {
      const book = await service.getBook(c.req.param("id"));
      return c.json<ApiResponse<Book>>({ success: true, data: book });
    } catch {
      return c.json<ApiResponse<never>>(
        { success: false, error: "The specified ID did not exist." },
        404,
      );
    }
  });

  app.post("/", zValidator("json", CreateBookSchema), async (c) => {
    const book = await service.createBook(c.req.valid("json"));
    return c.json<ApiResponse<Book>>({ success: true, data: book }, 201);
  });

  app.put(
    "/:id",
    zValidator("json", UpdateBookSchema),
    async (c) => {
      try {
        const book = await service.updateBook(
          c.req.param("id"),
          c.req.valid("json"),
        );
        return c.json<ApiResponse<Book>>({ success: true, data: book });
      } catch {
        return c.json<ApiResponse<never>>({
          success: false,
          error: "The specified ID did not exist.",
        }, 404);
      }
    },
  );

  app.delete("/:id", async (c) => {
    await service.deleteBook(c.req.param("id"));
    return c.json<ApiResponse<never>>({ success: true });
  });

  return app;
}
