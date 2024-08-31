import { exec, execSync, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/misc/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import path from 'path';
import { Green, Magenta, PastelGreen, PastelRed, Red, Reset, Yellow } from '../helpers/misc/colorCodes.js';
import { checkForUpdates } from '../helpers/startup/updateChecker.js'

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
    
    const useWinIconLauncher = (() => { 
        if (process.platform === 'win32') { 
            process.stdout.write('Checking whether winIconLauncher can be used ')
            try {
                const dotNetInfo = execSync('dotnet --info')

                if (dotNetInfo.toString().includes('8.')) {
                    console.log(`[${PastelGreen}DONE${Reset}]`)
                    return true
                } else {
                    console.log(`[${PastelRed}.NET 8.0 NOT FOUND${Reset}]`)
                }
            } catch (e) {
                console.log(`[${PastelRed}NO .NET RUNTIMES FOUND${Reset}]`)
            }
        }
        return false
    })()
    process.stdout.write('Launching termusic in a seperate window ')

    if (useWinIconLauncher) {
        spawn(`${getCrossPlatformString("new-terminal-window")} iconhost.exe launch`, [], {
            shell: true,
            cwd: path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'bin')
        })
    } else {
        spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
    }

    setTimeout(function() {
        console.log(`[${PastelGreen}DONE${Reset}]`)
        process.exit(0)
    }, 400)
}