export async function searchYoutube(query) {
    try {
        const request = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(query))
        const html = await request.text()
    
        const regex = /ytInitialData = {(.*)};<\/script/
    
        const videoField = JSON.parse('{' + html.match(regex)[1] + '}')['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'][0]['videoRenderer']
    
    
        const length = (videoField["lengthText"]['simpleText'].split(':')[0] * 60) + videoField["lengthText"]['simpleText'].split(':')[1]
    
        return {
            "title" : videoField['title']['runs'][0]['text'],
            "id" : videoField['videoId'],
            "length" : length,
            "thumbnail" : videoField['thumbnail']['thumbnails'][0]['url']
        } 
    } catch (e) {
        return false
    }
}