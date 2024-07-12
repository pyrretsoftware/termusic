import { playAudioUrl } from "../snippets/player.js"
import { getAudioUrl } from "./cobalt.js"
import { setPlayStatus } from "./playStatus.js"
import { setSongDuration, setSongTitle, startProgressBarMoving, startSongDurationMoving, updateProgressBar } from "./ui.js"

let list = []

export async function listContinue() {
    if (list[0]) {
        setPlayStatus("log", "Grabbing audio...")
        playAudioUrl((await getAudioUrl(list[0]["id"])))
        startProgressBarMoving(list[0]["length"])
        setSongTitle(list[0]["title"])
        startSongDurationMoving(list[0]["length"])
        setPlayStatus("important", `Now playing ${list[0]["title"]}!`)
        
        list.shift()
    } else {
        setSongTitle("no song playing")
        setSongDuration("0:00", "0:00")
        updateProgressBar(0)
    }
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
