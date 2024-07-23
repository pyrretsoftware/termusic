/*
termusic/snippets/player.js

Written by axell (mail@axell.me) for pyrret software.
*/
import { exec, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/crossPlatformHelper.js';

let currentlyPLayingAudio

export function killAudioProcesses() {
    if (currentlyPLayingAudio) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, {
            detached: true
        })
    }
}

export function playAudioUrl(url) {
    if (currentlyPLayingAudio) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, {
            detached: true
        })
    }

    //currentlyPLayingAudio = spawn(`ffplay "${url}" -nodisp`, [], {stdio: 'pipe', shell: true})
    currentlyPLayingAudio = exec(`ffplay "${url}" -nodisp`, {stdio: 'pipe', detached: true})

}
