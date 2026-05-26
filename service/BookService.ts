import { Book, CreateBookDto, UpdateBookDto } from "../model/book.ts";
import { BookRepository } from "../repository/interface/bookRepository.ts";

export class BookService {
  constructor(private readonly repo: BookRepository) {}

  listBooks(): Promise<Book[]> {
    return this.repo.findAll();
  }

  async getBook(id: string): Promise<Book> {
    const book = await this.repo.findById(id);
    if (!book) {
      console.error(`Book not found: ${id}`);
      throw new Error();
    }
    return book;
  }

  createBook(data: CreateBookDto): Promise<Book> {
    return this.repo.create(data);
  }

  updateBook(id: string, data: UpdateBookDto): Promise<Book> {
    return this.repo.update(id, data);
  }

  deleteBook(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
