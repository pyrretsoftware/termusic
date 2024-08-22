/*
termusic/helpers/configFileValidator.js

Written by axell (mail@axell.me) for pyrret software.
*/
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function validateConfig() {
    if (!fs.existsSync(path.join(__dirname, '../', '../', 'config.json'))) {
        console.error('Could not find config.json.')
        process.exit(1)
    }

    let parsedConfig
    try {
        parsedConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../', '../', 'config.json')));
    } catch (e) {
        console.error('Error parsing config file: ' + e)
        process.exit(1)
    }

    if (!parsedConfig["invidious-instances"] || !parsedConfig["cobalt-instances"]) {
        console.error('Could not find all neccessary fields in config file. Make sure you include "invidious-instances" and "cobalt-instances".')
        process.exit(1)
    }
    if (!parsedConfig["invidious-instances"][0] || !parsedConfig["cobalt-instances"][0]) {
        console.error('Make sure you have entered atleast one indivious and one cobalt instance.')
        process.exit(1)
    }
    return true
}