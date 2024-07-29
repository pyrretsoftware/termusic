import fs from 'fs';
import path from 'path';
import { setPlayStatus } from '../helpers/playStatus.js';
import { RGBToEscapeCode } from '../helpers/colorCodes.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let themeObject = {}

export function loadThemeObject(themeName) {
    if (fs.existsSync(path.join(__dirname, 'themes', themeName + '.json'))) {
        themeObject = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', themeName + '.json')));
    } else {
        setPlayStatus('important_err', 'Theme file not found.')
    }
}

const defualtCommandColors = {
    'commandSuccess' : 'rgb(13, 188, 121)',
    'commandError' : 'rgb(203, 89, 89)'
}

export function getThemeEscapeCode(themeColorType) {
    if (themeObject[themeColorType]) {
        return RGBToEscapeCode(themeObject[themeColorType])
    } else if (defualtCommandColors[themeColorType]) {
        return RGBToEscapeCode(defualtCommandColors[themeColorType])
    } else {
        return ''
    }
}