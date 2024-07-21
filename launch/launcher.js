import { spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import path from 'path';

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'termusic.js')

export function startLauncher() {
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} launch`, [], {shell: true})
    setTimeout(function() {
        console.log("Launched termusic in a seperate window✅")
        process.exit(0)
    }, 600)
}