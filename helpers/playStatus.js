import { reWriteCommandText } from "../ui/uiManagers/player.js";
import { clearBar } from "../ui/utils/clearBar.js";
import { moveCursorPos } from "../ui/utils/moveCursorPos.js";
import { changeRpcStatus } from "./discordRpc.js";


const widthChars = 46

export let outputWritten = false;

export function setPlayStatus(type, playStatus) { //playStatus can either be a string or a video object
    if (type == 'report') {
        changeRpcStatus(playStatus["title"], playStatus["thumbnail"], playStatus["id"])
    } else if (type == 'important' || type == 'important_err') {
        moveCursorPos(0, 4)
        if (playStatus.length > widthChars) {
            playStatus = playStatus.substring(0, widthChars - 3)
            playStatus = playStatus + '...'
        }
        process.stdout.write((type == 'important' ? '\x1b[32m' : '\x1b[31m') + '\x1b[2m'  + playStatus + '\x1b[0m')
        outputWritten = true
        moveCursorPos(0, 0)
        setTimeout(function() {
            clearBar()
            reWriteCommandText()
            outputWritten = false
        }, 3000)
    }
}