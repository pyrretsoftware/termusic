export async function searchYoutube(query, isTest = false) {
    try {
        const request = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(query + " song"))
        const html = await request.text()
    
        const regex = /ytInitialData = {(.*)};<\/script/
    
        const videoField = JSON.parse('{' + html.match(regex)[1] + '}')['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'][0]['videoRenderer']
    
    
        const length = (parseInt(videoField["lengthText"]['simpleText'].split(':')[0]) * 60) + parseInt(videoField["lengthText"]['simpleText'].split(':')[1])
    
        return {
            "title" : videoField['title']['runs'][0]['text'],
            "id" : videoField['videoId'],
            "length" : length,
            "thumbnail" : videoField['thumbnail']['thumbnails'][0]['url']
        } 
    } catch (e) {
        return isTest ? e : false
    }
}