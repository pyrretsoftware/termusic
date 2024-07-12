/*
termusic/helpers/invidious.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {config} from '../snippets/config.js'

let currentInstance = 0

export async function searchInvidious(query) {
    const invidiousRequest = await fetch(config["invidious-instances"][currentInstance] + `/api/v1/search?q=${encodeURIComponent(query)}&type=video&duration=short`, {
        method : "GET",
        headers : {
            "Content-type": "application/json"
        }
    })

    if (config["invidious-instances"][currentInstance + 1]) {
        currentInstance++
    } else {
        currentInstance = 0
    }
    let invidiousResponse
    try {
        invidiousResponse = await invidiousRequest.json()
    } catch {
        return false
    }
    if (!invidiousResponse[0]) {
        return false
    }

    return {
        "title" : invidiousResponse[0]["title"],
        "id" : invidiousResponse[0]["videoId"],
        "length" : invidiousResponse[0]["lengthSeconds"],
        "thumbnail" : invidiousResponse[0]["videoThumbnails"][0]["url"]
    } 
}