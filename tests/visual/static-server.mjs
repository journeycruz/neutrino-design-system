import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "apps/storybook/storybook-static");
const port = Number(process.env.PORT ?? 6006);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const toFilePath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = normalize(decoded).replace(/^\/+/, "");
  const candidate = normalized === "" ? "index.html" : normalized;
  return join(root, candidate);
};

const server = createServer(async (req, res) => {
  const reqPath = req.url ?? "/";
  let filePath = toFilePath(reqPath);

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    const ext = extname(filePath);
    res.setHeader("Content-Type", contentTypes[ext] ?? "application/octet-stream");
    createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`storybook-static server listening on ${port}\n`);
});
