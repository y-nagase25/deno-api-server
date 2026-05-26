import { Book, CreateBookDto, UpdateBookDto } from "../model/book.ts";
import { BookRepository } from "./interface/BookRepository.ts";
import { Filters } from "./interface/Repository.ts";

const KV_PREFIX = ["books"] as const;

export class BookKvRepository implements BookRepository {
  constructor(private readonly kv: Deno.Kv) {}

  async findAll(_filters?: Filters): Promise<Book[]> {
    const entries = this.kv.list<Book>({ prefix: KV_PREFIX });
    const books = [];
    for await (const entry of entries) {
      books.push(entry.value);
    }
    return books;
  }

  async findById(id: string): Promise<Book | null> {
    const result = await this.kv.get<Book>([...KV_PREFIX, id]);
    return result.value;
  }

  async create(data: CreateBookDto): Promise<Book> {
    const book: Book = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    // Immutable: create a new Map instead of mutating
    await this.kv.set([...KV_PREFIX, book.id], book);

    return book;
  }

  async update(id: string, data: UpdateBookDto): Promise<Book> {
    const existing = await this.findById(id);
    if (!existing) throw new Error();

    const updated: Book = { ...existing, ...data };
    await this.kv.set([...KV_PREFIX, id], updated);

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.kv.delete([...KV_PREFIX, id]);
  }
}
