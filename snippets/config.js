import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'config.json')))