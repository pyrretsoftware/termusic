import fs from 'fs';
import path from 'path';
import { setPlayStatus } from '../helpers/player/playStatus.js';
import { RGBToEscapeCode } from '../helpers/misc/colorCodes.js';
import { fileURLToPath } from 'url';
import { config, editConfigValue } from '../snippets/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let themeObject = config['storedTheme']

export function loadThemeObject(themeName) {
    if (themeName == 'defualt') {
        themeObject = null
        (async () => { //async for if the drive is slow
            editConfigValue('storedTheme', themeObject)
        })()
        setPlayStatus('important', 'Set theme to defualt!')
    } else if (fs.existsSync(path.join(__dirname, 'themes', themeName + '.json'))) {
        themeObject = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', themeName + '.json')));
        (async () => { //async for if the drive is slow
            editConfigValue('storedTheme', themeObject)
        })()
        setPlayStatus('important', 'Applied theme!')
    } else {
        setPlayStatus('important_err', 'Theme file not found.')
    }
}

const defualtCommandColors = {
    'commandSuccess' : 'rgb(13, 188, 121)',
    'commandError' : 'rgb(203, 89, 89)',
    'log' : 'rgb(231, 245, 67)',
    'question' : 'rgb(116, 105, 182)'
}

export function getThemeEscapeCode(themeColorType) {
    if (themeObject && themeObject[themeColorType]) {
        return RGBToEscapeCode(themeObject[themeColorType])
    } else if (defualtCommandColors[themeColorType]) {
        return RGBToEscapeCode(defualtCommandColors[themeColorType])
    } else {
        return RGBToEscapeCode('rgb(255, 255, 255)') //the reason this isnt a blank string is so it overwrites the previous color.
    }
}