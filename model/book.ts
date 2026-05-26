import { z } from "zod";

export const BookSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  createdAt: z.iso.datetime(),
});

export const CreateBookSchema = BookSchema.omit({ id: true, createdAt: true });
export const UpdateBookSchema = CreateBookSchema.partial();

export type Book = z.infer<typeof BookSchema>;
export type CreateBookDto = z.infer<typeof CreateBookSchema>;
export type UpdateBookDto = z.infer<typeof UpdateBookSchema>;
