/*
termusic/helpers/cobalt.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {config} from '../snippets/config.js'
import { setPlayStatus } from './playStatus.js'

let currentInstance = 0

export async function getAudioUrl(id ) {

    const cobaltRequest = await fetch(config["cobalt-instances"][currentInstance], {
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
    const cobaltResponse = await cobaltRequest.json()
    
    if (cobaltResponse['status'] == 'error') {
        setPlayStatus('important_err', 'Cobalt reported an error, check status.cobalt.tools')
        return false
    }

    if (config["cobalt-instances"][currentInstance + 1]) {
        currentInstance++
    } else {
        currentInstance = 0
    }
    
    return cobaltResponse["url"]
}