import http from 'http'
import { execSync, exec } from 'child_process';

import { changeUiPlayState, passedTime } from '../../ui/uiManagers/player.js' 
import { getCrossPlatformString } from '../misc/crossPlatformHelper.js';
import { setPlayStatus } from '../player/playStatus.js';
import { config } from '../../snippets/config.js';

export let currentlyPLayingAudio = {
    'audioProcess': null,
    'audioBuffer' : null,
    'mimeType' : 'audio/mp3', //radio is not streamed as audio but as video,
    'isPlaying': false,
    'usesLegacyPlayback' : false
}
export let port
let audioVolume = 100

export function killAudioProcesses() {
    if (currentlyPLayingAudio['audioProcess'] && currentlyPLayingAudio['isPlaying']) {
        execSync(getCrossPlatformString("kill-process") + currentlyPLayingAudio['audioProcess'].pid, {
            windowsHide: true
        })
    }
}

export function changeAudioVolume(vol) {
    if (parseInt(vol) && vol <= 100 && vol >= 0) {
        audioVolume = vol
        setPlayStatus("important", "Changed volume.")
    } else {
        setPlayStatus("important_err", "Invalid value.")
    }
}

export function changePlayState() {
    if (!currentlyPLayingAudio['audioBuffer'] && config['memorySavingMode']) {
        setPlayStatus('important_err', 'Pausing isnt supported with memory saving mode.')
        return
    } else if (!currentlyPLayingAudio['audioBuffer']) {
        setPlayStatus('important_err', 'Still buffering audio, please wait before pausing.')
        return
    }

    if (currentlyPLayingAudio['isPlaying']) { 
        changeUiPlayState(false)

        killAudioProcesses()
        currentlyPLayingAudio['isPlaying'] = false
    } else {
        changeUiPlayState(true)

        currentlyPLayingAudio['isPlaying'] = true
        currentlyPLayingAudio['audioProcess'] = exec(`ffplay "http://127.0.0.1:${port}/stream" -ss ${passedTime} -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
    }
}
export async function playSlsfAudioUrl(url) {
    setPlayStatus('log', 'Waiting for fetch to begin...')
    currentlyPLayingAudio['audioBuffer'] = null
    const audioRequest = await fetch(url)

    if (!audioRequest.ok) {
        setPlayStatus('important_err', 'Failed to fetch audio, error ' + audioRequest.status)
    }
    if (audioRequest.headers.get('Content-Type') == 'application/x-mpegURL') {
        currentlyPLayingAudio['audioProcess'] = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
        currentlyPLayingAudio['isPlaying'] = true
        currentlyPLayingAudio['usesLegacyPlayback'] = true

        if (currentlyPLayingAudio['audioProcess']) {
            exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio['audioProcess'].pid, {
                detached: true,
                windowsHide: true
            })
        }
        return
    }

    currentlyPLayingAudio['usesLegacyPlayback'] = false;
    (async () => {
        if (!config['memorySavingMode']) {
            currentlyPLayingAudio['audioBuffer'] = await audioRequest.arrayBuffer()
        }
    })();
    
    setPlayStatus('log', 'Cleaning up ffplay processes...')
    if (currentlyPLayingAudio['audioProcess']) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio['audioProcess'].pid, {
            detached: true,
            windowsHide: true
        })
    }

    setPlayStatus('log', 'Waiting for ffmpeg...')
    currentlyPLayingAudio['audioProcess'] = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
    currentlyPLayingAudio['mimeType'] = audioRequest.headers.get('Content-Type')
    currentlyPLayingAudio['isPlaying'] = true

    
}

function generatePortNumber() {
    //generates a port number thats not and cant be registered with IANA
    //see https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Dynamic,_private_or_ephemeral_ports

    return Math.floor(Math.random() * 65535 - 49152) + 49152
}
export function startAudioServer() {
    try {
        port = generatePortNumber()
        http.createServer(async (req, res) => {
            if (req.url == '/stream') {
                res.setHeader("Content-Type", currentlyPLayingAudio['mimeType'])
                res.write(Buffer.from(currentlyPLayingAudio['audioBuffer']))
            }
            res.end()
        }).listen(port)
    } catch (e) {
        startAudioServer()
    }
}