import ep from 'easy-presence'

const _ep = new ep.EasyPresence("1263923824613920861")

export function changeRpcStatus(title, thumbnail, id) {
    _ep.setActivity({
        details: "Listening to " + title,
        assets: {
            large_image: thumbnail
        },
        timestamps: { start: new Date() },
        buttons : [
            {
                label: "View song",
                url: "https://termusic.axell.me/?s=" + id
            }
        ]
    })
}