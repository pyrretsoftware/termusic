/*
termusic/helpers/invidious.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {config} from '../../snippets/config.js'
import { setPlayStatus } from '../player/playStatus.js'

let currentInstance = 0

export async function searchInvidious(query, searchType = 'song') {
    let invidiousRequest
    try {
        invidiousRequest = await fetch(config["invidious-instances"][currentInstance] + `/api/v1/search?q=${encodeURIComponent(query)}&type=` + (searchType == 'song' ? 'video' : searchType), {
            method : "GET",
            headers : {
                "Content-type": "application/json"
            }
        })
    } catch (e) {
        setPlayStatus('log', 'Search failed, trying again...')
        if (config["invidious-instances"][currentInstance + 1]) {
            currentInstance++
        } else {
            currentInstance = 0
        }
    }

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

    if (searchType == 'playlist') {
        let playlistVideos = []
        for (let item in invidiousResponse[0]['videos']) {
            playlistVideos.push({
                "title" : invidiousResponse[0]['videos'][item]["title"],
                "id" : invidiousResponse[0]['videos'][item]["videoId"],
                "length" : invidiousResponse[0]['videos'][item]["lengthSeconds"],
                "thumbnail" : invidiousResponse[0]['videos'][item]["videoThumbnails"][0]["url"]
            })
        }

        return {
            'title' : invidiousResponse[0]['title'],
            'playlistId' : invidiousResponse[0]['playlistId'],
            'videoCount' : invidiousResponse[0]['videoCount'],
            'videos' : playlistVideos
        }
    }

    
    return {
        "isLive" : !invidiousResponse[0]["lengthSeconds"],
        "title" : invidiousResponse[0]["title"],
        "id" : invidiousResponse[0]["videoId"],
        "length" : invidiousResponse[0]["lengthSeconds"],
        "thumbnail" : invidiousResponse[0]["videoThumbnails"][0]["url"]
    } 
}

export async function getLiveStreamUrl(id)  {
    let pageRequest
    const regex = /<source src="(.*)" type/

    while (!pageRequest) {
        try {
            pageRequest = await fetch(`${config["invidious-instances"][currentInstance]}/watch?v=${id}`, {
                signal: AbortSignal.timeout(5000)
            })

            if (!pageRequest.ok) {
                throw new Error('HTTP Error code: ' + response.statusCode)
            }
        } catch {
            setPlayStatus('log', 'Scrape failed, trying again...')
            if (config["invidious-instances"][currentInstance + 1]) {
                currentInstance++
            } else {
                currentInstance = 0
            }
        }
    }

    let html = await pageRequest.text()
    if (!html.match(regex)) {
        return
    }
    return `${config['invidious-instances'][currentInstance]}${html.match(regex)[1]}`
    
}