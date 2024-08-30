/*
termusic/snippets/player.js

Written by axell (mail@axell.me) for pyrret software.
*/
import { exec, execSync, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/misc/crossPlatformHelper.js';
import { setPlayStatus } from '../helpers/player/playStatus.js';

let currentlyPLayingAudio
let audioVolume = 100

export function killAudioProcesses() {
    if (currentlyPLayingAudio) {
        execSync(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, {
            windowsHide: true
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
            detached: true,
            windowsHide: true
        })
    }

    //currentlyPLayingAudio = spawn(`ffplay "${url}" -nodisp`, [], {stdio: 'pipe', shell: true})
    currentlyPLayingAudio = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
    await fetch(url)
}
