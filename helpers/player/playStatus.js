import { config } from "../../snippets/config.js";
import { getThemeEscapeCode } from "../../ui/themes.js";
import { isTypingCommand, reWriteCommandText } from "../../ui/uiManagers/player.js";
import { clearBar } from "../../ui/utils/clearBar.js";
import { moveCursorPos } from "../../ui/utils/moveCursorPos.js";
import { changeRpcStatus } from "../misc/discordRpc.js";

export let outputWritten = false;
export let currentSongReport 
export let currentSongPlayingReport

const widthChars = 46
const idlingImageStyle = config['idlingImageStyle']

export let answer
export let statusText = ''

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
    } else if (type == 'important' || type == 'important_err' || type == 'log') {
        if (type == 'log' && isTypingCommand) return

        moveCursorPos(0, 4)
        if (playStatus.length > widthChars) {
            playStatus = playStatus.substring(0, widthChars - 3)
            playStatus = playStatus + '...'
        }
        clearBar()

        const themes = {
            'important' : getThemeEscapeCode('commandSuccess'),
            'important_err' : getThemeEscapeCode('commandError'),
            'log' : getThemeEscapeCode('log')
        }

        process.stdout.write(themes[type]  + playStatus + '\x1b[0m')
        statusText = themes[type]  + playStatus + '\x1b[0m'

        outputWritten = true
        moveCursorPos(0, 0)
        setTimeout(function() {
            if (outputWritten && type != 'log') {
                clearBar()
                reWriteCommandText()
                outputWritten = false
            }
        }, 3000)
    }
}

export function ask(question) {
    return new Promise((resolve) => {
        moveCursorPos(0, 4)
        if (question.length > widthChars) {
            question = question.substring(0, widthChars - 3)
            question = question + '...'
        }
        clearBar()
        outputWritten = true
        answer = (val) => {
            resolve(val)
            answer = undefined
        }
        process.stdout.write(getThemeEscapeCode('question') + question + ' (y/n)' + '\x1b[0m')
        statusText = getThemeEscapeCode('question') + question + ' (y/n)' + '\x1b[0m'
    })
}
export function setoutputWritten(val) {
    outputWritten = val
}