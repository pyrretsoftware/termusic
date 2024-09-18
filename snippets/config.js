import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let config = {}
export function reloadConfig() {
    if (fs.existsSync(path.join(__dirname, '../', 'config.json'))) {
        config = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'config.json')))    
    } else {
        config = {}
    }
}

export function editConfigValue(field, value) {
    let modifiedConfig = config
    modifiedConfig[field] = value;
    fs.writeFileSync(path.join(__dirname, '../', 'config.json'), JSON.stringify(modifiedConfig, null, 4));
}

reloadConfig()