import { spawn } from 'child_process';
import { getCrossPlatformString } from './helpers/crossPlatformHelper.js'

export function startLauncher() {
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${__filename} launch`, [], {shell: true})
    setTimeout(function() {
        console.log("Launched termusic in a seperate window✅")
        process.exit(0)
    }, 500)
}