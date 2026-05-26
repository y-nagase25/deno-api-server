import { Book, CreateBookDto, UpdateBookDto } from "../../model/book.ts";
import { Repository } from "./Repository.ts";

// Domain-specific repository interface — no DB details here
export interface BookRepository
  extends Repository<Book, CreateBookDto, UpdateBookDto> {}
