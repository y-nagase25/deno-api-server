const kv = await Deno.openKv();

interface CreateLinkBody {
  slug: string;
  url: string;
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-_]{1,40}$/.test(slug);
}

export function handler(req: Request): Promise<Response> | Response {
  return (async () => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (req.method === "POST") {
      let body: CreateLinkBody;
      try {
        body = await req.json();
      } catch {
        return json({ error: "Invalid JSON body" }, { status: 400 });
      }

      const { slug, url } = body;
      if (!slug || !url) {
        return json({ error: "'slug' and 'url' are required" }, {
          status: 400,
        });
      }
      if (!isValidSlug(slug)) {
        return json({ error: "Invalid slug format" }, { status: 422 });
      }
      try {
        new URL(url);
      } catch {
        return json({ error: "'url' must be an absolute URL" }, {
          status: 422,
        });
      }

      // Prevent overwriting an existing slug using an atomic check
      const key = ["links", slug];
      const txResult = await kv.atomic().check({ key, versionstamp: null }).set(
        key,
        url,
      ).commit();
      if (!txResult.ok) {
        return json({ error: "Slug already exists" }, { status: 409 });
      }
      return json({ slug, url }, { status: 201 });
    }

    // Redirect short links – extract slug from pathname
    const slug = new URL(req.url).pathname.slice(1); // remove leading '/'
    if (!slug) {
      return json({
        message: "Provide a slug in the path or POST to create one.",
      }, { status: 400 });
    }
    const result = await kv.get<[string] | string>(["links", slug]);
    const target = result.value as string | null;
    if (!target) {
      return json({ error: "Slug not found" }, { status: 404 });
    }
    return Response.redirect(target, 301);
  })();
}

export function startServer(port: number = 8000) {
  Deno.serve({ port }, handler);
  console.log(`Server started on port ${port}`);
}
