import { exec, execSync, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/misc/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'
import { Green, Magenta, PastelGreen, PastelRed, Red, Reset, Yellow } from '../helpers/misc/colorCodes.js';
import { checkForUpdates } from '../helpers/startup/updateChecker.js'
import { config, editConfigValue, reloadConfig } from '../snippets/config.js';
import { validateConfig } from '../helpers/startup/configFileValidator.js'
import { generatePortNumber } from '../helpers/core/playAudio.js';

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'termusic.js')

const updateNotice = `There is a new version of termusic available (${Green}v{v}${Reset}). To update, run ${Green}'npm update -g termusic'${Reset}`
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
    process.stdout.write('Preparing ')
    const configPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'config.json')
    const installConfigPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'installConfig.json')

    if (parseInt(process.version.split('.')[0].replace('v', '')) < 18) {
        console.log(` [${PastelRed}INCOMPATIBLE NODE.JS VERSION${Reset}]`)
        console.log(nodeUpdateNotice)
        process.exit(1)
    } else if (fs.existsSync(installConfigPath)) {
        if (fs.existsSync(configPath)) {
            //user has used termusic previously and is updatin
            const oldConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
            let newConfig = JSON.parse(fs.readFileSync(installConfigPath, 'utf8'))

            Object.entries(newConfig).forEach(entry => {
                const [key, value] = entry
                if (Object.keys(oldConfig).includes(key)) {
                    newConfig[key] = oldConfig[key]
                }
            })
            fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4))
            fs.unlinkSync(installConfigPath)
        } else {
            //new termusic install
            fs.writeFileSync(configPath, fs.readFileSync(installConfigPath, 'utf8'))
            fs.unlinkSync(installConfigPath)
        }
        reloadConfig()
    }

    console.log(`[${PastelGreen}DONE${Reset}]`)
    validateConfig()

    process.stdout.write('Checking for updates ')
    const updateStatus = await checkForUpdates()
    if (updateStatus) {
        console.log(` [${PastelRed}UPDATES FOUND${Reset}]`)
        console.log(updateNotice.replace('{v}', updateStatus))
    } else {
        console.log(`[${PastelGreen}DONE${Reset}]`)
    }


    process.stdout.write('Launching termusic in a seperate window ')
    
    if (config['useWinIconLauncher'] && process.platform === 'win32') {
        let port
        if (config['useWinIconLauncher'] == 'notSure') {
            port = await generatePortNumber()
        }

        spawn(`${getCrossPlatformString("new-terminal-window")} winIconLauncher.exe launch${config['useWinIconLauncher'] == 'notSure' ? '-port-' + port : 'gfgf'}`, [], {
            shell: true,
            cwd: path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'wic')
        })
        if (config['useWinIconLauncher'] == 'notSure') {
            await new Promise(resolve => setTimeout(resolve, 3000))

            const processAlive = await (async () => {
                try {
                    const results = await (await fetch(`http://127.0.0.1:${port}/test`, { signal: AbortSignal.timeout(5000) })).text()
                    if (results == 'success') return true

                    return false
                } catch (e) {
                    return false
                }
            })()

            if (!processAlive) {
                console.log(`[${PastelRed}FAILED${Reset}]`)
                process.stdout.write('Launching termusic with the legacy launcher ')
                spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
                editConfigValue('useWinIconLauncher', false)
            } else {
                editConfigValue('useWinIconLauncher', true)
            }
        }
    } else {
        spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
    }

    setTimeout(function() {
        console.log(`[${PastelGreen}DONE${Reset}]`)
        process.exit(0)
    }, 400)
}