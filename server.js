/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import { readFile } from 'fs/promises';

export default function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();

  app.use(express.static(`${__dirname}/public`));

  app.get('/', async (req, res) => {
    res.send(await readFile(`${__dirname}/public/index.html`, 'utf-8'));
  });

  app.listen(3000);
}
