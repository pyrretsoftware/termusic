import { Red, Reset, RGBToEscapeCode } from '../../helpers/colorCodes.js'
import { moveCursorPos } from '../utils/moveCursorPos.js';
import fs from 'fs';
import path from 'path';
import { config } from '../../snippets/config.js';
import { fileURLToPath } from 'url';
import { getThemeEscapeCode } from '../themes.js';
import { checkForUpdates } from '../../helpers/updateChecker.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
const accentColor = 'rgb(255, 143, 171)'
const DarkerAccentColor = 'rgb(251, 111, 146)'
*/
const accentColor = 'rgb(70, 70, 70)'
const DarkerAccentColor = 'rgb(41, 41, 41)'

process.stdout.on('resize', () => {
    if (process.argv[2] == 'about') {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "15").replaceAll("w", "73"))
        
        setTimeout(() => {
            moveCursorPos(0, 0)
            process.stdout.write(' \b\b')//make sure we dont scroll down during resize 
        }, 150)
    }
}); 

const asciiIcon = //29 width and 13 height
`===++++++++++++++++++++++++
=++++++++++++++++++-...  +++#
=+++++++++++-...     ##. #++#
=+++++++++.  -########+. #++#
=++++++++- -###++++++++. #++#
=++++++++- -#++++++++++. #++#
=++++++++- -#++++++++++. #++#
=++++++++- -#++++++++++. #++#
=+++       -#++++-       #++#
=++        -#+++-        #++#
=+++      -##++++-      #+++#
=+++++++++++++++++++++++++++#
===########################`
.replaceAll('-', ' ')
.replaceAll('.', ' ')
.replaceAll(' ', `${RGBToEscapeCode('rgb(255, 255, 255)', 'bg')} ${Reset}`)
.replaceAll('+', `${RGBToEscapeCode(accentColor, 'bg')} ${Reset}`)
.replaceAll('#', `${RGBToEscapeCode(DarkerAccentColor, 'bg')} ${Reset}`)
.replaceAll('=', ` `);


export async function showAbout() {
    const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../', '../', 'package.json')))["version"]
    const updates = await checkForUpdates()

    console.clear()
    console.log()
    console.log(asciiIcon)
    moveCursorPos(31, 1)
    process.stdout.write(`${RGBToEscapeCode('rgb(255, 255, 255)')}Termusic`)
    moveCursorPos(31, 3)
    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Release:${Reset} Termusic version ${currentVersion}`)
    moveCursorPos(31, 4)
    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Source:${Reset} ${!fs.existsSync(path.join(__dirname,  '../', '../', 'images')) ? 'npm' : 'A repository clone'}`)
    moveCursorPos(31, 5)
    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Developers:${Reset} axell (mail@axell.me)`)
    moveCursorPos(31, 7)
    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Invidious instances:${Reset} ${config['invidious-instances'].length}`)
    moveCursorPos(31, 8)
    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Cobalt instances:${Reset} ${config['cobalt-instances'].length}`)
    moveCursorPos(31, 10)

    const date = new Date()

    const weekDays = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]

    process.stdout.write(`${RGBToEscapeCode('rgb(90, 90, 90)')}Today: ${Reset}${weekDays[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`)
    moveCursorPos(31, 12)
    process.stdout.write(!updates ? `${getThemeEscapeCode('commandSuccess')}There are no updates available.${Reset}` : `${getThemeEscapeCode('log')}There are one or more updates available.${Reset}`)

}