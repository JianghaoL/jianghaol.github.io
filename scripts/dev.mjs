import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 4173);
const TYPES = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"], [".png", "image/png"], [".jpg", "image/jpeg"],
  [".gif", "image/gif"], [".mp3", "audio/mpeg"], [".mp4", "video/mp4"], [".pdf", "application/pdf"]
]);

createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const requested = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
    const absolute = path.resolve(ROOT, `.${requested}`);

    // The server is intentionally incapable of reading outside the repository.
    if (!absolute.startsWith(`${ROOT}${path.sep}`)) throw new Error("Unsafe path");
    const info = await stat(absolute);
    if (!info.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Content-Type": TYPES.get(path.extname(absolute).toLowerCase()) || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    createReadStream(absolute).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Local site: http://127.0.0.1:${PORT}/en/`);
});
