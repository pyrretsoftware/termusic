import _ep from 'easy-presence'
import { setPlayStatus } from '../player/playStatus.js';
import { config } from '../../snippets/config.js';

let ep
let connected = false

if (process.argv[2] == 'launch') {
    ep = new _ep.EasyPresence("1263923824613920861")

    ep.on('connected', () => {
        connected = true
        setPlayStatus('important', 'Connected to Discord.')
        setTimeout(() => {
            setPlayStatus("report", {
                'special' : 'idling'
            })
        }, 500) //wait a little before starting discordrpc
    })
    ep.on('disconnected', () => connected = false)
}

export function changeRpcStatus(title, thumbnail, id, idling = false) {
    if (!config['discordRpcEnabled']) {
        return
    }

    let activity = {
        details: (idling == false ? ("Listening to " + title) : 'Idling'),
        assets: {
            large_image: thumbnail + '?cacheStop=' + Math.floor(Math.random() * 500)
        },
        timestamps: { start: new Date() },
    }

    if (!idling) {
        activity['buttons'] = [
            {
                label: "View song",
                url: "https://termusic.axell.me/?s=" + id
            }
        ]
    }

    ep.setActivity(activity)
}