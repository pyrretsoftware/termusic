import fs from 'fs';
import { Green, Reset } from './colorCodes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function checkForUpdates() {
    const latestVersion = (await (await fetch('https://github.com/pyrretsoftware/termusic/raw/main/package.json')).json())["version"]
    const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))["version"]

    if (currentVersion != latestVersion) {
        return latestVersion
    }
    return false
}
