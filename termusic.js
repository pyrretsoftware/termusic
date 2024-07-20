#!/usr/bin/env node
/*
termusic/termusic.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {validateConfig} from './helpers/configFileValidator.js'
import { spawn } from 'child_process';
import { getCrossPlatformString } from './helpers/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import { displayPlayUi } from './helpers/ui.js';

const __filename = fileURLToPath(import.meta.url);
process.stdout.write(String.fromCharCode(27) + "]0;Termusic" + String.fromCharCode(7));
validateConfig()


if (process.argv[2] == "launch") {
    setInterval(function() {}, 1000 * 60 * 60);
    console.clear()
    if (process.argv[3] != "debug") {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))      
    }
    displayPlayUi("no song playing")
} else {
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${__filename} launch`, [], {shell: true})
    setTimeout(function() {
        console.log("Launched termusic in a seperate window✅")
        process.exit(0)
    }, 500)
}
