import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3001;
const NAME = 'service-1';
const DATA_DIR = path.join(import.meta.dirname, 'data');

const app = express();

app.get('/:resource', (req, res) => {
  const resource = req.params.resource;
  const filename = `${resource}.json`;
  const filepath = path.join(DATA_DIR, filename);

  try {
    const contents = fs.readFileSync(filepath, 'utf-8');
    res.type('application/json').send(contents);
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') {
      res.status(404).json({
        error: `${NAME}: no fixture at data/${filename}. Drop a JSON file there to serve GET /${resource}.`,
      });
      return;
    }
    res.status(500).json({ error: `${NAME}: ${e.message ?? String(err)}` });
  }
});

app.get('/', (_req, res) => {
  const files = fs.existsSync(DATA_DIR)
    ? fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
    : [];
  res.json({
    service: NAME,
    port: PORT,
    routes: files.map((f) => `/${f.replace(/\.json$/, '')}`),
    hint: 'Drop JSON files into data/ — each one is served at /<basename>.',
  });
});

app.listen(PORT, () => {
  console.log(`[${NAME}] listening on http://localhost:${PORT}`);
});
