import { fileURLToPath } from 'url';
import path from 'path';
import { config } from '../snippets/config.js';
import fs from 'fs';

export async function searchYoutube(query, isTest = false) {
    try {
        const request = await fetch(isTest ? 'https://apis.axell.me/termusic/v1/ytScrape-proxy/california-girls' : ('https://www.youtube.com/results?search_query=' + encodeURIComponent(query + " song")))
        const html = await request.text()
    
        const regex = /ytInitialData = {(.*)};<\/script/
    
        const pageContent = JSON.parse('{' + html.match(regex)[1] + '}')['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']

        let videoField
        for (let item in pageContent) {
            if (pageContent[item]['videoRenderer']) {
                videoField = pageContent[item]['videoRenderer']
                break;
            }
        }

        if (!videoField) {
            throw new Error('No videoRenderer found')
        }
        if (process.argv[3] == 'debug') {
            fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'debugFiles', 'ytInitialData.json'), JSON.stringify(JSON.parse('{' + html.match(regex)[1] + '}')['contents'], null, 4))
        }
    
        const length = (parseInt(videoField["lengthText"]['simpleText'].split(':')[0]) * 60) + parseInt(videoField["lengthText"]['simpleText'].split(':')[1])
    
        return {
            "title" : videoField['title']['runs'][0]['text'],
            "id" : videoField['videoId'],
            "length" : length,
            "thumbnail" : videoField['thumbnail']['thumbnails'][0]['url']
        } 
    } catch (e) {
        if (process.argv[3] == 'debug') {
            console.log(e)
        }
        return false
    }
}