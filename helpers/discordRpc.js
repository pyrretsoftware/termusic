import ep from 'easy-presence'

const _ep = new ep.EasyPresence("1263923824613920861")

export function changeRpcStatus(title, thumbnail, id, idling = false) {
    _ep.setActivity({
        details: (idling == false ? ("Listening to " + title) : 'Idling'),
        assets: {
            large_image: thumbnail + '?cacheStop=' + Math.floor(Math.random() * 500)
        },
        timestamps: { start: new Date() },
        /*buttons : (idling == true ? [] : [
            {
                label: "View song",
                url: "https://termusic.axell.me/?s=" + id
            }
        ]),*/
    })
}