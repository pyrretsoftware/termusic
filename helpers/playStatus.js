import { config } from "../snippets/config.js";
import { getThemeEscapeCode } from "../ui/themes.js";
import { reWriteCommandText } from "../ui/uiManagers/player.js";
import { clearBar } from "../ui/utils/clearBar.js";
import { moveCursorPos } from "../ui/utils/moveCursorPos.js";
import { changeRpcStatus } from "./discordRpc.js";

export let outputWritten = false;
export let currentSongReport 
export let currentSongPlayingReport

const widthChars = 46
const idlingImageStyle = config['idlingImageStyle']

export function setPlayStatus(type, playStatus) { //playStatus can either be a string or a video object
    if (type == 'report') {
        if (playStatus['special'] == 'idling') {
            changeRpcStatus(null, 'https://apis.axell.me/termusic/v1/idling-images/from-style/' + idlingImageStyle, null, true)
            currentSongPlayingReport = []
        } else {
            changeRpcStatus(playStatus["title"], playStatus["thumbnail"], playStatus["id"])
            currentSongReport = playStatus
            currentSongPlayingReport = playStatus
        }
    } else if (type == 'important' || type == 'important_err') {
        moveCursorPos(0, 4)
        if (playStatus.length > widthChars) {
            playStatus = playStatus.substring(0, widthChars - 3)
            playStatus = playStatus + '...'
        }
        clearBar()
        process.stdout.write((type == 'important' ? getThemeEscapeCode('commandSuccess') : getThemeEscapeCode('commandError'))  + playStatus + '\x1b[0m')
        outputWritten = true
        moveCursorPos(0, 0)
        setTimeout(function() {
            if (outputWritten) {
                clearBar()
                reWriteCommandText()
                outputWritten = false
            }
        }, 3000)
    } else if (type == 'log') {
        moveCursorPos(0, 4)
        if (playStatus.length > widthChars) {
            playStatus = playStatus.substring(0, widthChars - 3)
            playStatus = playStatus + '...'
        }
        clearBar()
        process.stdout.write(playStatus)
        outputWritten = true
        moveCursorPos(0, 0)
        setTimeout(function() {
            if (outputWritten) {
                clearBar()
                reWriteCommandText()
                outputWritten = false
            }
        }, 3000)
    }
}
export function setoutputWritten(val) {
    outputWritten = val
}