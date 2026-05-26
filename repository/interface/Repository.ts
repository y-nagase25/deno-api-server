export interface Filters {
  [key: string]: unknown;
}

// Generic repository contract — every domain repository extends this
export interface Repository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  findAll(filters?: Filters): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
