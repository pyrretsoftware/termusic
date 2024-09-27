import _ep from 'easy-presence'
import { setPlayStatus } from '../player/playStatus.js';
import { config } from '../../snippets/config.js';

let ep

let lastActivity

if (process.argv[2]?.includes('launch') && config['discordRpcEnabled']) {
    ep = new _ep.EasyPresence("1263923824613920861")

    ep.on('connected', () => {
        setPlayStatus('important', 'Connected to Discord.')
        setTimeout(() => {
            if (!lastActivity?.['title']) return
            setPlayStatus("report", lastActivity)
        }, 500) //wait a little before starting discordrpc
    })
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

    lastActivity = activity
    ep.setActivity(activity)
}