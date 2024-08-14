/*
termusic/snippets/player.js

Written by axell (mail@axell.me) for pyrret software.
*/
import { exec, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/crossPlatformHelper.js';
import { setPlayStatus } from '../helpers/playStatus.js';

let currentlyPLayingAudio
let audioVolume = 100

export function killAudioProcesses() {
    if (currentlyPLayingAudio) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, {
            detached: true
        })
    }
}
export function changeAudioVolume(vol) {
    if (parseInt(vol) && vol <= 100) {
        audioVolume = vol
        setPlayStatus("important", "Changed volume.")
    } else {
        setPlayStatus("important_err", "Invalid value.")
    }
}

export async function playAudioUrl(url) {
    if (currentlyPLayingAudio) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, {
            detached: true
        })
    }

    //currentlyPLayingAudio = spawn(`ffplay "${url}" -nodisp`, [], {stdio: 'pipe', shell: true})
    currentlyPLayingAudio = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
    await fetch(url)
}
