import app from "./hono.ts";

Deno.serve(app.fetch);
