/*
termusic/helpers/cobalt.js

Written by axell (mail@axell.me) for pyrret software.
*/
import path from 'path'
import {config} from '../../snippets/config.js'
import { setPlayStatus } from '../player/playStatus.js'
import fs from 'fs'
import { fileURLToPath } from 'url'

let currentInstance = 0

export async function getAudioUrl(id) {
    let cobaltRequest
    try {
        cobaltRequest = await fetch(config["cobalt-instances"][currentInstance], {
            method : "POST",
            body : JSON.stringify({
                "url": "https://www.youtube.com/watch?v=" + id,
                "isAudioOnly": "true"
            }),
            headers : {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        })
    } catch (e) {
        setPlayStatus('important_err', 'Cobalt request threw error.')
    }
    let cobaltResponse = await cobaltRequest.json()
    let retryTimes = 3

    if (cobaltResponse['status'] == 'error' && cobaltResponse['text'].includes('process videos longer than') ) {
        setPlayStatus('important_err', 'Cobalt can only handle songs up to 3 hours.')
        return false
    }

    while (cobaltResponse['status'] == 'error' && retryTimes != 0) {
        setPlayStatus('log', 'Cobalt failed, trying again...')
        retryTimes -= 1
        try {
            cobaltRequest = await fetch(config["cobalt-instances"][currentInstance], {
                method : "POST",
                body : JSON.stringify({
                    "url": "https://www.youtube.com/watch?v=" + id,
                    "isAudioOnly": "true"
                }),
                headers : {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            })
        } catch (e) {
            setPlayStatus('important_err', 'Cobalt request threw error.')
        }
        cobaltResponse = await cobaltRequest.json()
    }

    if (cobaltResponse['status'] == 'error') {
        setPlayStatus('important_err', 'Cobalt failed, check status.cobalt.tools')
        if (process.argv[3] == 'debug') {
            fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../', '../', 'debugFiles', 'cobaltError.json'), JSON.stringify(cobaltResponse, null, 4)) 
        }

        return false
    }

    if (config["cobalt-instances"][currentInstance + 1]) {
        currentInstance++
    } else {
        currentInstance = 0
    }
    return cobaltResponse["url"]
}