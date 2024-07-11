/*
termusic/snippets/player.js

Written by axell (mail@axell.me) for pyrret software.
*/
import { exec, spawn } from 'child_process';
import { getCrossPlatformString } from '../helpers/crossPlatformHelper.js';

let currentlyPLayingAudio

export function playAudioUrl(url) {
    if (currentlyPLayingAudio) {
        spawn(getCrossPlatformString("kill-process") + currentlyPLayingAudio.pid, [], {
            shell: true
        })
    }

    currentlyPLayingAudio = exec(`ffplay "${url}" -nodisp -autoexit`, {stdio: 'pipe', detached: true})
}
