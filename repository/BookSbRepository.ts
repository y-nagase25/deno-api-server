import { SupabaseClient } from "@supabase/supabase-js";
import { BookRepository } from "./interface/BookRepository.ts";
import { Filters } from "./interface/Repository.ts";
import { Book, CreateBookDto, UpdateBookDto } from "../model/book.ts";

export class BookSbRepository implements BookRepository {
  constructor(private readonly sb: SupabaseClient) {}

  async findAll(_filters?: Filters): Promise<Book[]> {
    const query = this.sb.from("books").select<"", Book>();
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<Book | null> {
    const query = this.sb.from("books").select<"", Book>().eq("id", id);
    const { data, error } = await query;
    if (error) throw error;
    return data?.[0] || null;
  }

  async create(data: CreateBookDto): Promise<Book> {
    const query = this.sb.from("books").insert(data).select<"", Book>();
    const { data: book, error } = await query;
    if (error) throw error;
    return book?.[0] || null;
  }

  async update(id: string, data: UpdateBookDto): Promise<Book> {
    const query = this.sb.from("books").update(data).eq("id", id).select<
      "",
      Book
    >();
    const { data: book, error } = await query;
    if (error) throw error;
    return book?.[0] || null;
  }

  async delete(id: string): Promise<void> {
    const query = this.sb.from("books").delete().eq("id", id);
    const { error } = await query;
    if (error) throw error;
  }
}
