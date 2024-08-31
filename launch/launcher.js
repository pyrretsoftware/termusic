import { exec, execSync, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/misc/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import path from 'path';
import { Green, Magenta, PastelGreen, PastelRed, Red, Reset, Yellow } from '../helpers/misc/colorCodes.js';
import { checkForUpdates } from '../helpers/startup/updateChecker.js'
import { config } from '../snippets/config.js';

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'termusic.js')

const updateNotice = `${Magenta}There is a new version of termusic available (${Green}v{v}${Magenta}). To update, run ${Green}'npm update -g termusic'${Reset}`
const nodeUpdateNotice = `${PastelRed}Your version of Node.js is not supported. Please use Node.js ${PastelGreen}v18${PastelRed} or later.${Reset}`

export async function startQuickLauncher() {
    process.stdout.write('Launching termusic in a seperate window ')
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})

    setTimeout(function() {
        console.log(`[${PastelGreen}DONE${Reset}]`)
        process.exit(0)
    }, 250)
}
export async function startLauncher() {
    process.stdout.write('Checking Node.js version ')
    if (parseInt(process.version.split('.')[0].replace('v', '')) < 18) {
        console.log(` [${PastelRed}INCOMPATIBLE VERSION${Reset}]`)
        console.log(nodeUpdateNotice)
    } else {
        console.log(`[${PastelGreen}DONE${Reset}]`)
    }

    process.stdout.write('Checking for updates ')
    const updateStatus = await checkForUpdates()
    if (updateStatus) {
        console.log(` [${PastelRed}UPDATES FOUND${Reset}]`)
        console.log(updateNotice.replace('{v}', updateStatus))
    } else {
        console.log(`[${PastelGreen}DONE${Reset}]`)
    }
    process.stdout.write('Launching termusic in a seperate window ')

    if (config['useWic']) {
        spawn(`${getCrossPlatformString("new-terminal-window")} winIconLauncher.exe launch`, [], {
            shell: true,
            cwd: path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'wic')
        })
    } else {
        spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
    }

    setTimeout(function() {
        console.log(`[${PastelGreen}DONE${Reset}]`)
        process.exit(0)
    }, 400)
}