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
            external: true,
            windowsHide: true
        })
    }
}
export function killProcess(process) {
    exec(getCrossPlatformString("kill-process") + process.pid, {
        external: true,
        windowsHide: true
    })
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
        setPlayStatus('important_err', 'Still buffering audio, wait before pausing.')
        return
    }

    if (currentlyPLayingAudio['isPlaying']) { 
        changeUiPlayState(false)

        killAudioProcesses()
        currentlyPLayingAudio['isPlaying'] = false
    } else {
        changeUiPlayState(true)

        currentlyPLayingAudio['isPlaying'] = true
        currentlyPLayingAudio['audioProcess'] = exec(`ffplay "http://127.0.0.1:${port}/stream" -ss ${passedTime} -nodisp -volume ${audioVolume}`)
    }
}
export async function playSlsfAudioUrl(url) {
    setPlayStatus('log', 'Waiting for fetch to begin...')
    currentlyPLayingAudio['audioBuffer'] = null
    let audioRequest
    try {
        audioRequest = await fetch(url)
    } catch (e) {
        setPlayStatus('important_err', 'Failed to fetch audio, error ' + e)
        return
    }

    if (!audioRequest.ok) {
        setPlayStatus('important_err', 'Failed to fetch audio, error ' + audioRequest.status)
    }
    if (audioRequest.headers.get('Content-Type') == 'application/x-mpegURL') {
        const oldAudioProcess = currentlyPLayingAudio['audioProcess']
        currentlyPLayingAudio['audioProcess'] = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`)
        currentlyPLayingAudio['isPlaying'] = true
        currentlyPLayingAudio['usesLegacyPlayback'] = true

        /*
        async function getInnerPlaylist(rawPlaylist) {
            const playlist = rawPlaylist.split('\n')

            for (let i = 0; i < playlist.length; i++) {
                if (playlist[i].startsWith('http')) {
                    return (await fetch(playlist[i])).text()
                }
            }
        }

        await getInnerPlaylist(await getInnerPlaylist(await audioRequest.text()))*/

        //i know were assuming that it takes 10 seconds here, but from my testing its always been accurate
        for (let i = 0; i < 10; i++) {
            setPlayStatus('log', `Loading audio stream (${i}/10)`)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        if (oldAudioProcess) {
            killProcess(oldAudioProcess)
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
        killProcess(currentlyPLayingAudio['audioProcess'])
    }

    setPlayStatus('log', 'Waiting for ffmpeg...')
    currentlyPLayingAudio['audioProcess'] = exec(`ffplay "${url}" -nodisp -volume ${audioVolume}`)
    currentlyPLayingAudio['mimeType'] = audioRequest.headers.get('Content-Type')
    currentlyPLayingAudio['isPlaying'] = true

    
}

export async function generatePortNumber() {
    //generates a port number thats not and cant be registered with IANA
    //see https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Dynamic,_private_or_ephemeral_ports

    const randomPort = Math.floor(Math.random() * 65535 - 49152) + 49152
    let server = http.createServer((req, res) => {})
    try {
        server.listen(randomPort) 
        await new Promise(resolve => {
            server.on('listening', (socket) => {
                server.close()
                resolve()
            })
        })
    } catch (e) {
        return await generatePortNumber()   
    }
    return randomPort
}
export async function startAudioServer() {
    if (process.argv[2].includes('port-')) {
        port = parseInt(process.argv[2].replace('launch-port-', ''))
    } else  {
        port = await generatePortNumber()
    }
    http.createServer(async (req, res) => {
        if (req.url == '/stream') {
            res.setHeader("Content-Type", currentlyPLayingAudio['mimeType'])

            if (currentlyPLayingAudio['audioBuffer']) {
                res.write(Buffer.from(currentlyPLayingAudio['audioBuffer']))
            } else {
                res.write('whar')
            }
        } else if (req.url == '/test') {
            res.write('success')
        }
        res.end()
    }).listen(port)
}