/*
termusic/helpers/commandprocessor.js

Written by axell (mail@axell.me) for pyrret software.
*/
import { getAudioUrl } from './cobalt.js'
import { searchInvidious } from './invidious.js';
import { changeAudioVolume, playAudioUrl} from '../snippets/player.js'
import { currentSongPlayingReport, setPlayStatus } from './playStatus.js';
import { performFullRealTimeReRender, setSongTitle, startProgressBarMoving, startSongDurationMoving } from '../ui/uiManagers/player.js';
import { addSong, clearList, listContinue, removeLastSong, toggleLooping } from './listManager.js';
import { loadThemeObject } from '../ui/themes.js';
import clipboard from 'clipboardy';


export async function processCommand(command) {
    switch (command.split(" ")[0]) {
        case 'play' :
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
            setPlayStatus("important", `Now playing ${searchResult["title"]}!`)
            startProgressBarMoving(searchResult["length"])
            setSongTitle(searchResult["title"])
            startSongDurationMoving(searchResult["length"])
            setPlayStatus("report", searchResult);
            break;
        case 'queue' :
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
                setPlayStatus("important", `Added ${searchResult["title"]} to the queue!`)
            } else if (command.split(" ")[1] == "remove") {
                removeLastSong()
            } else if (command.split(" ")[1] == "clear") {
                clearList()
            } else if (command.split(" ")[1] == "skip") {
                listContinue(true)
            }
            break;
        case 'exit': 
            console.clear()
            process.kill(process.pid, 'SIGTERM');
        case 'volume':
            changeAudioVolume(command.split(" ")[1])
            break;
        case 'share':
            if (currentSongPlayingReport) {
                clipboard.write('https://termusic.axell.me?s=' + currentSongPlayingReport['id'])
                setPlayStatus('important', 'Copied song link to clipboard!')
            } else {
                setPlayStatus('important_err', 'No song playing.')
            }
            break;
        case 'loop':
            toggleLooping(true)
            break;
        case 'noloop':
            toggleLooping(false)
            break;
        case 'theme':
            loadThemeObject(command.replace('theme ', ''))
            performFullRealTimeReRender()
            setPlayStatus('important', 'Applied theme!')
            break;
        case 'reloadui':
            console.clear()
            performFullRealTimeReRender()
            if (process.argv[3] != "debug") {
                process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))
            }
            setPlayStatus('important', 'Reloaded ui!')
            break;
        default:
            setPlayStatus("important_err", "Unknown command.")
            break;
    }
}
