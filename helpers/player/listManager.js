import { getAudioUrl } from "../misc/cobalt.js"
import { currentSongReport, setPlayStatus } from "./playStatus.js"
import { setSongDuration, setSongTitle, startMoving, updateProgressBar } from "../../ui/uiManagers/player.js"
import { changeProgramTitleStatus } from "./programTitle.js"
import { currentlyPLayingAudio, playSlsfAudioUrl } from "../core/playAudio.js"

let list = []
let looping = false

export async function listContinue(isSkip = false) {
    if (looping) {
        restartSong()
    } else if (list[0]) {
        setPlayStatus("log", "Grabbing audio...")
        
        const audio = await (list[0]['isLive'] ? getLiveStreamUrl : getAudioUrl)(list[0]["id"])
        if (!audio) return

        await playSlsfAudioUrl(audio)

        startMoving(list[0]["length"])
        setSongTitle(list[0]["title"])

        setPlayStatus("important", `Now playing ${list[0]["title"]}!`)
        changeProgramTitleStatus(list[0]['isLive'] ? 'radio' : 'playing')
        setPlayStatus("report", list[0])
        list.shift()
    } else if (!isSkip) {
        setSongTitle("no song playing")
        currentlyPLayingAudio['isPlaying'] = false
        changeProgramTitleStatus('idling')
        updateProgressBar(0)
        setSongDuration("0:00", "0:00")
        setPlayStatus("report", {
            'special' : 'idling'
        })
    } else {
        setPlayStatus("important_err", "Couldn't skip song, no songs in the queue.")
    }
}
export async function restartSong() {
    if (currentSongReport) {
        setPlayStatus("log", "Grabbing audio...")
        
        const audio = await (currentSongReport['isLive'] ? getLiveStreamUrl : getAudioUrl)(currentSongReport["id"])
        if (!audio) return

        await playSlsfAudioUrl(audio)

        startMoving(currentSongReport["length"])
        setSongTitle(currentSongReport["title"])

        setPlayStatus("important", `Restarted song ${currentSongReport["title"]}!`)
        changeProgramTitleStatus(currentSongReport['isLive'] ? 'radio' : 'playing')
        setPlayStatus("report", currentSongReport)
    }
}

export function toggleLooping(value) {
    if (value == looping) {
        setPlayStatus("important_err", `Looping is already ${looping ? 'enabled' : 'disabled'}.`)
        return
    }
    looping = value
    setPlayStatus("important", `${looping ? 'Enabled' : 'Disabled'} looping!`)
}

export function addSong(song) {
    list.push(song);
}
export function removeLastSong() { 
    list.pop()
}
export function clearList() {
    list = []
}
export function replaceList(newList) {
    list = newList
}
