import supabase from "../../lib/supabase.ts";
import { CreateBookDto } from "../book.ts";

const adjectives = [
  "The Great",
  "The Dark",
  "A New",
  "Return of",
  "Mystery of",
  "Journey to",
  "Echoes of",
  "Secrets of",
  "Beyond the",
  "Whispers in",
];
const nouns = [
  "World",
  "Knight",
  "Hope",
  "King",
  "Ocean",
  "Stars",
  "Forest",
  "Shadows",
  "Time",
  "Wind",
];
const names = [
  "James",
  "John",
  "Robert",
  "Michael",
  "William",
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Elizabeth",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomBook(): CreateBookDto {
  const title = `${getRandomItem(adjectives)} ${getRandomItem(nouns)}`;
  const author = getRandomItem(names);

  return {
    title,
    author,
  };
}

async function main(count = 10) {
  console.log(`Seeding ${count} books...`);

  const booksToInsert: CreateBookDto[] = Array.from(
    { length: count },
    () => generateRandomBook(),
  );

  const { data, error } = await supabase
    .from("books")
    .insert(booksToInsert)
    .select();

  if (error) {
    console.error("Error seeding books:", error.message);
    Deno.exit(1);
  }

  console.log(`Successfully seeded ${data?.length} books!`);
  console.log(data);
}

// Execute the seed script
if (import.meta.main) {
  main();
}
