/*
termusic/helpers/cobalt.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {config} from '../../snippets/config.js'
import { setPlayStatus } from '../player/playStatus.js'

let currentInstance = 0

export async function getAudioUrl(id ) {

    let cobaltRequest = await fetch(config["cobalt-instances"][currentInstance], {
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
    let cobaltResponse = await cobaltRequest.json()
    let retryTimes = 3


    while (cobaltResponse['status'] == 'error' && retryTimes != 0) {
        setPlayStatus('log', 'Cobalt failed, trying again...')
        retryTimes -= 1

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
        cobaltResponse = await cobaltRequest.json()
    }

    if (cobaltResponse['status'] == 'error') {
        setPlayStatus('important_err', 'Cobalt failed, check status.cobalt.tools')
        return false
    }

    if (config["cobalt-instances"][currentInstance + 1]) {
        currentInstance++
    } else {
        currentInstance = 0
    }
    
    return cobaltResponse["url"]
}