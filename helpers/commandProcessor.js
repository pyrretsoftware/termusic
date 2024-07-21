/*
termusic/helpers/commandprocessor.js

Written by axell (mail@axell.me) for pyrret software.
*/
import {getAudioUrl} from './cobalt.js'
import { searchInvidious } from './invidious.js';
import {playAudioUrl} from '../snippets/player.js'
import { setPlayStatus } from './playStatus.js';
import {setSongTitle, startProgressBarMoving, startSongDurationMoving } from '../ui/uiManagers/player.js';
import { addSong, clearList, removeLastSong } from './listManager.js';



export async function processCommand(command) {
    setPlayStatus("log", "Starting command processor, processing "+ command.replace("play ", ""))
    if (command.split(" ")[0] == "play") {
        setPlayStatus("log", "Processing " + command.replace("play ", ""))
        setPlayStatus("log", "Searching...")
        let searchResult = await searchInvidious(command.replace("play ", ""))
        setPlayStatus("log", "Searching complete.")
        while (!searchResult) {
            setPlayStatus("log", "Retrying search.")
            searchResult = await searchInvidious(command.replace("play ", ""))
        }
        
        setPlayStatus("log", "Grabbing audio...")
        playAudioUrl((await getAudioUrl(searchResult["id"])))
        startProgressBarMoving(searchResult["length"])
        setSongTitle(searchResult["title"])
        startSongDurationMoving(searchResult["length"])
        setPlayStatus("important", `Now playing ${searchResult["title"]}!`)
        setPlayStatus("report", searchResult)        
    } else if (command.split(" ")[0] == "queue") {
        if (command.split(" ")[1] == "add")  {
            setPlayStatus("log", "Processing " + command.replace("queue add", ""))
            setPlayStatus("log", "Searching...")
            let searchResult = await searchInvidious(command.replace("queue add", ""))
            setPlayStatus("log", "Searching complete.")
            while (!searchResult) {
                setPlayStatus("log", "Retrying search.")
                searchResult = await searchInvidious(command.replace("queue add", ""))
            }
            addSong(searchResult)
            setPlayStatus("important", `Added ${searchResult["title"]} to queue!`)
        } else if (command.split(" ")[1] == "remove") {
            removeLastSong()
        } else if (command.split(" ")[1] == "clear") {
            clearList()
        }
    }
}