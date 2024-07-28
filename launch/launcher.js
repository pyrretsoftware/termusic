import { spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import path from 'path';
import { Green, Magenta, PastelGreen, PastelRed, Red, Reset, Yellow } from '../helpers/colorCodes.js';
import { checkForUpdates } from '../helpers/updateChecker.js'

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'termusic.js')

const updateNotice = `${Magenta}There is a new version of termusic available (${Green}v{v}${Magenta}). To update, run ${Green}'npm update -g termusic'${Reset}`

export async function startLauncher() {
    process.stdout.write('Checking for updates ')
    const updateStatus = await checkForUpdates()
    if (updateStatus) {
        console.log(` [${PastelRed}UPDATES FOUND${Reset}]`)
        console.log(updateNotice.replace('{v}', updateStatus))
    } else {
        console.log(`[${PastelGreen}DONE${Reset}]`)
    }
    process.stdout.write('Launching termusic in a seperate window ')
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
    setTimeout(function() {
        console.log(`[${PastelGreen}DONE${Reset}]`)
        process.exit(0)
    }, 400)
}