/*
termusic/helpers/cobalt.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {config} from '../snippets/config.js'

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
    
    if (config["cobalt-instances"][currentInstance + 1]) {
        currentInstance++
    } else {
        currentInstance = 0
    }
    
    if (cobaltRequest.status != 200) {
        return "ERROR: " + cobaltRequest.status + ": "
    }
    return cobaltResponse["url"]
}