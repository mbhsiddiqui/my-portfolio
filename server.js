import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

const app = express();

let vite;

if (!isProd) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);
} else {
  app.use('/assets', express.static(path.resolve(__dirname, 'dist/client/assets'), { index: false }));
  app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));
}

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl;
    let template;
    let render;

    if (!isProd) {
      template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = await fs.readFile(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const appHtml = await render(url);
    const html = template.replace('<!--app-html-->', appHtml);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    if (!isProd && vite) {
      vite.ssrFixStacktrace(error);
    }
    res.status(500).end(error.stack);
  }
});

app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
