import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { ask } from '../player/playStatus.js';

export async function scrapePlaylist(plId) {
    try {
        const request = await fetch('https://www.youtube.com/playlist?list=' + plId)
        const html = await request.text()
    
        const regex = /ytInitialData = {(.*)};<\/script/
        const pageContent = JSON.parse('{' + html.match(regex)[1] + '}')['contents']['twoColumnBrowseResultsRenderer']['tabs'][0]['tabRenderer']['content']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'][0]['playlistVideoListRenderer']['contents']

        let playlistVideos = []
        for (let item in pageContent) {
            if (pageContent[item]['playlistVideoRenderer']) {
                const length = (parseInt(pageContent[item]['playlistVideoRenderer']["lengthText"]['simpleText'].split(':')[0]) * 60) + parseInt(pageContent[item]['playlistVideoRenderer']["lengthText"]['simpleText'].split(':')[1])

                playlistVideos.push({
                    "title" : pageContent[item]['playlistVideoRenderer']['title']['runs'][0]['text'],
                    "id" : pageContent[item]['playlistVideoRenderer']['videoId'],
                    "length" : length,
                    "thumbnail" : pageContent[item]['playlistVideoRenderer']['thumbnail']['thumbnails'][0]['url']
                })
            }
        }

        if (process.argv[3] == 'debug') {
            fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../', '../', 'debugFiles', 'ytPlaylist.json'), JSON.stringify(JSON.parse('{' + html.match(regex)[1] + '}'), null, 4))
        }
        return playlistVideos
    } catch (e) {
        console.log(e)
    }
}
export async function searchYoutube(query, searchType = 'song') {
    try {
        const request = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' ' + searchType))
        const html = await request.text()
    
        const regex = /ytInitialData = {(.*)};<\/script/
    
        const pageContent = JSON.parse('{' + html.match(regex)[1] + '}')['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']

        let videoField
        for (let item in pageContent) {
            if (searchType == 'song' && pageContent[item]['videoRenderer']) {
                videoField = pageContent[item]['videoRenderer']
                break;
            } else if (searchType == 'playlist' && pageContent[item]['playlistRenderer']) {
                return {
                    'title' : pageContent[item]['playlistRenderer']['title']['simpleText'],
                    'playlistId' : pageContent[item]['playlistRenderer']['playlistId'],
                    'videoCount' : pageContent[item]['playlistRenderer']['videoCount'],
                    'videos' : (await scrapePlaylist(pageContent[item]['playlistRenderer']['playlistId']))
                }
            } else if (pageContent[item]['didYouMeanRenderer']) {
                let correctedQuery = ""
                pageContent[item]['didYouMeanRenderer']['correctedQuery']['runs'].forEach(queryItem => {
                    correctedQuery += queryItem['text']
                });

                correctedQuery = correctedQuery.replace(' song', '')
                if ((await ask('Did you mean ' + correctedQuery + '?'))) {
                    return {
                        'status' : 'typeIssue',
                        'query' : correctedQuery
                    }
                }
            }
        }

        if (!videoField) {
            throw new Error('No videoRenderer found')
        }
        if (process.argv[3] == 'debug') {
            fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../', '../', 'debugFiles', 'ytInitialData.json'), JSON.stringify(JSON.parse('{' + html.match(regex)[1] + '}')['contents'], null, 4))
        }
    
        let length = null
        if (videoField["lengthText"]) {
            length = 0
            const lengthsBackwards = videoField["lengthText"]['simpleText'].split(':').reverse()

            for (let i = 0; i < lengthsBackwards.length; i++) {
                length += parseInt(lengthsBackwards[i]) * Math.pow(60, i)
            }
        }

        return {
            "isLive" : !videoField["lengthText"],
            "title" : videoField['title']['runs'][0]['text'],
            "id" : videoField['videoId'],
            "length" : length,
            "thumbnail" : videoField['thumbnail']['thumbnails'][0]['url']
        } 
    } catch (e) {
        if (process.argv[3] == 'debug') {
            throw new Error(e.message)
        }
        return false
    }
}