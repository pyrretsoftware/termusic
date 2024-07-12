/*
termusic/termusic.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {validateConfig} from './helpers/configFileValidator.js'
import { spawn, exec } from 'child_process';
import {playAudioUrl} from './snippets/player.js'
import { getCrossPlatformString } from './helpers/crossPlatformHelper.js'
import { fileURLToPath } from 'url';
import {getAudioUrl} from './helpers/cobalt.js'
import { searchInvidious } from './helpers/invidious.js';
import { config } from './snippets/config.js';
import { setPlayStatus } from './helpers/playStatus.js';
import { displayPlayUi } from './helpers/ui.js';

const __filename = fileURLToPath(import.meta.url);
process.stdout.write(String.fromCharCode(27) + "]0;Termusic" + String.fromCharCode(7));
validateConfig()


if (process.argv[2] == "launch") {
    setInterval(function() {
        //this is to keep to process running
    }, 1000 * 60 * 60);

    if (process.argv[3] != "debug") {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))      
    }
    
    /*
    setPlayStatus("Searching...")
    let searchResult = await searchInvidious("gamblecore")
    setPlayStatus("Searching complete.")
    while (!searchResult) {
        setPlayStatus("Retrying search.")
        searchResult = await searchInvidious("gamblecore")
    }
    
    setPlayStatus("Grabbing audio...")
    */
    displayPlayUi("no song playing")
    
    //playAudioUrl((await getAudioUrl(searchResult["id"])))
} else {
    spawn(`${getCrossPlatformString("new-terminal-window")} node ${__filename} launch`, [], {shell: true})
    console.log("Launched termusic in a seperate window✅")
}
