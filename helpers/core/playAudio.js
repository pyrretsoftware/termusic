import http from 'http'
import { execSync, exec } from 'child_process';

import { changeUiPlayState, passedTime } from '../../ui/uiManagers/player.js' 
import { getCrossPlatformString } from '../misc/crossPlatformHelper.js';

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
    if (parseInt(vol) && vol <= 100) {
        audioVolume = vol
        setPlayStatus("important", "Changed volume.")
    } else {
        setPlayStatus("important_err", "Invalid value.")
    }
}

export function changePlayState() {
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
    if (currentlyPLayingAudio['audioProcess']) {
        exec(getCrossPlatformString("kill-process") + currentlyPLayingAudio['audioProcess'].pid, {
            detached: true,
            windowsHide: true
        })
    }

    const audioRequest = await fetch(url)
    if (audioRequest.headers.get('Content-Type') == 'application/vnd.apple.mpegurl') {
        currentlyPLayingAudio['audioBuffer'] = null
        currentlyPLayingAudio['audioProcess'] = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
        currentlyPLayingAudio['isPlaying'] = true
        return
    }

    currentlyPLayingAudio['usesLegacyPlayback'] = audioRequest.headers.get('Content-Type') == 'application/vnd.apple.mpegurl'
    currentlyPLayingAudio['audioBuffer'] = await (audioRequest).arrayBuffer()
    currentlyPLayingAudio['audioProcess'] = exec(`ffplay "http://127.0.0.1:${port}/stream" -nodisp -volume ${audioVolume}`, {stdio: 'pipe', detached: true})
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