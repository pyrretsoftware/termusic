import _ep from 'easy-presence'
import { setPlayStatus } from './playStatus.js';

let ep
let connected = false

if (process.argv[2] == 'launch') {
    ep = new _ep.EasyPresence("1263923824613920861")

    ep.on('connected', () => {
        connected = true
        setPlayStatus("report", {
            'special' : 'idling'
        })
        setPlayStatus('important', 'Connected to Discord.')
    })
    ep.on('disconnected', () => connected = false)
}

export function changeRpcStatus(title, thumbnail, id, idling = false) {
    if (!connected) {
        setPlayStatus('important_err', 'Could not connect to Discord.')
    }

    ep.setActivity({
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