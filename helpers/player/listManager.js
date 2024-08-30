import { playAudioUrl } from "../../snippets/player.js"
import { getAudioUrl } from "../misc/cobalt.js"
import { currentSongReport, setPlayStatus } from "./playStatus.js"
import { setSongDuration, setSongTitle, startProgressBarMoving, startSongDurationMoving, updateProgressBar } from "../../ui/uiManagers/player.js"
import { changeProgramTitleStatus } from "./programTitle.js"

let list = []
let looping = false

export async function listContinue(isSkip = false) {
    if (looping) {
        restartSong()
    } else if (list[0]) {
        setPlayStatus("log", "Grabbing audio...")
        
        const audio = await (list[0]['isLive'] ? getLiveStreamUrl : getAudioUrl)(list[0]["id"])
        if (!audio) return

        setPlayStatus("log", "Waiting for ffmpeg...")
        await playAudioUrl(audio)

        startProgressBarMoving(list[0]["length"])
        setSongTitle(list[0]["title"])
        startSongDurationMoving(list[0]["length"])
        setPlayStatus("important", `Now playing ${list[0]["title"]}!`)
        changeProgramTitleStatus(list[0]['isLive'] ? 'radio' : 'playing')
        setPlayStatus("report", list[0])
        list.shift()
    } else if (!isSkip) {
        setSongTitle("no song playing")
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

        setPlayStatus("log", "Waiting for ffmpeg...")
        await playAudioUrl(audio)

        startProgressBarMoving(currentSongReport["length"])
        setSongTitle(currentSongReport["title"])
        startSongDurationMoving(currentSongReport["length"])
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
