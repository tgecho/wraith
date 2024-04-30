import { defineConfig, loadEnv } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { homedir } from "node:os";
import path from "node:path";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const CONTENT_ROOT =
    env.VITE_CONTENT_ROOT || path.join(homedir(), "wraith_docs");

  const CustomEndpointsPlugin = {
    name: "custom-endpoints",
    configureServer(server) {
      server.middlewares.use("/files", async (req, res, next) => {
        try {
          if (req.url === "/" && req.method === "GET") {
            await mkdir(CONTENT_ROOT, { recursive: true });
            const files = await readdir(CONTENT_ROOT);
            return res.end(JSON.stringify(files));
          } else {
            const filePath = path.join(CONTENT_ROOT, req.url);

            if (req.method === "GET") {
              try {
                const contents = await readFile(filePath, "utf-8");
                return res.end(contents);
              } catch (e) {
                if (e.code === "ENOENT") {
                  res.statusCode = 404;
                  return res.end("Not Found");
                } else {
                  throw e;
                }
              }
            } else if (req.method === "PUT") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              return req.on("end", async () => {
                await mkdir(path.dirname(filePath), { recursive: true });
                await writeFile(filePath, body, "utf-8");
                res.statusCode = 204;
                return res.end();
              });
            } else if (req.method === "DELETE") {
              try {
                await unlink(filePath);
                res.statusCode = 204;
                return res.end();
              } catch (e) {
                if (e.code === "ENOENT") {
                  res.statusCode = 404;
                  return res.end("Not Found");
                } else {
                  throw e;
                }
              }
            }
          }
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          return res.end("Internal Server Error");
        }
        next();
      });
    },
  };

  return defineConfig({
    plugins: [
      svelte({
        preprocess: vitePreprocess(),
      }),
      CustomEndpointsPlugin,
    ],
    server: {
      proxy: {
        "/v1": {
          target: env.VITE_AI_HOST,
          hostRewrite: true,
        },
      },
    },
  });
};
