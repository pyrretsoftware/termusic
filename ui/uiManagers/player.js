//this needs refactoring, mainly better naming.
import readline from 'readline';
import process from 'process';

import { processCommand } from '../../helpers/core/commandProcessor.js';
import { getCrossPlatformString } from '../../helpers/misc/crossPlatformHelper.js';
import { listContinue, restartSong } from '../../helpers/player/listManager.js';
import { killAudioProcesses } from '../../snippets/player.js';

import { centerText } from '../utils/centerText.js';
import { moveCursorPos } from '../utils/moveCursorPos.js';
import { clearBar } from '../utils/clearBar.js';
import { answer, currentSongReport, outputWritten, setoutputWritten } from '../../helpers/player/playStatus.js';
import { PastelRed, Red, Reset } from '../../helpers/misc/colorCodes.js';
import { getThemeEscapeCode } from '../themes.js';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);   
}
process.stdout.on('resize', () => {
    if (process.argv[2] == 'launch') {
        console.clear()
        performFullRealTimeReRender()
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))    
    }
}); 

const startString = 1
const commandString = 4
const heightChars = 5
const widthChars = 46

let command = ""
export let isTypingCommand = false

//#region playerMetadata

function calculateDisplayTime(time) {
    if (time == null) return `${PastelRed}Live${Reset}`

    let hours = Math.floor(time / 3600)
    let min = (time - (time % 60) - (hours * 3600)) / 60
    let sec = (time % 60).toString().padStart(2, '0')
    
    if (hours > 0) {
        return hours + ":" + min + ":" + sec
    } else {
        return min + ":" + sec
    }
} 

export async function updateProgressBar(steps) { //steps/30
    moveCursorPos(8, startString +1)
    process.stdout.write(`\x1b[1m${getThemeEscapeCode('progressBar')}` + `──────────────────────────────`.slice(0, steps) + `${Reset}\x1b[2m${getThemeEscapeCode('progressBar')}` + '──────────────────────────────'.slice(steps) + '\x1b[0m')
    
    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar'))
    } else {
        moveCursorPos(0, 0)
    }
}
let passedTime = 0 //another horrible way of doing this
export function setSongDuration(dur1, dur2) {
    clearBar(startString + 1)
    updateProgressBar(passedTime)
    moveCursorPos(3, startString + 1)
    process.stdout.write(getThemeEscapeCode('songTitle') + dur1)

    moveCursorPos(39, startString + 1)
    process.stdout.write(dur2 + Reset)

    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar'))
    } else {
        moveCursorPos(0, 0)
    }
}
function changePlayState(state) {
    moveCursorPos(23, startString + 2)
    process.stdout.write('\b' + getThemeEscapeCode('mediaComponents') + (state ? '▶️' : '⏸️') + Reset)
}
export function setSongTitle(title) {
    moveCursorPos(widthChars, startString)
    for (let i = 0; i < widthChars; i++) {
        process.stdout.write("\b \b")
    }
    process.stdout.write(`\x1b[1m${getThemeEscapeCode('songTitle')}` + centerText(title, widthChars) + Reset)

    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
    } else {
        moveCursorPos(0, 0)
    }
}
let currentSongIndex = 0; //this is a horrible way of doing this..
let passedTimeBars = 0
export async function startMoving(length) {
    currentSongIndex++
    let  _currentSongIndex = currentSongIndex;

    (async () => {
        for (let i = 0; i < (length ? length : Infinity); i++) {
            passedTimeBars  = i
            if (currentSongIndex != _currentSongIndex) {
                return
            }
            setSongDuration(calculateDisplayTime(i), calculateDisplayTime(length))
            await new Promise(resolve => setTimeout(resolve,  1000));
        }
        setSongDuration("0:00", "0:00")
    })();

    (async () => {
        if (!length) {
            passedTime = 0
            updateProgressBar(0)
            return
        }
        for (let i = 0; i < (30); i++) { 
            if (currentSongIndex != _currentSongIndex) {
                return
            }
            passedTime = i
            updateProgressBar(i)
            await new Promise(resolve => setTimeout(resolve, (length / 30) * 1000));
        }
        listContinue()
    })();
}
const mediaComponents = {
    "progressBar" : "{0} ────────────────────────────── {1}", //30 lines
    "mediaComponent" : "◀◀ ▶ ▶▶"
}
export async function displayPlayUi(title) {
    setSongTitle(title)
    setSongDuration('0:00', '0:00')
    updateProgressBar(0)
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText(process.argv[3] == 'debug' ? mediaComponents["mediaComponent"] : getCrossPlatformString("mediaComponents"), widthChars) + Reset)
}

export async function reWriteCommandText() {
    if (isTypingCommand) {
        moveCursorPos(0, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar') + " >" + command + Reset)
    }

}

//#endregion

//#region themes
export async function performFullRealTimeReRender() {
    let songInfo = {
        'title' : 'no song playing',
        'length' : 0
    }
    if (currentSongReport) {
        songInfo = currentSongReport
    }
    setSongTitle(songInfo['title'])
    setSongDuration(calculateDisplayTime(passedTimeBars), calculateDisplayTime(songInfo['length']))
    updateProgressBar(passedTime)
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText(process.argv[3] == 'debug' ? mediaComponents["mediaComponent"] : getCrossPlatformString("mediaComponents"), widthChars) + Reset)
}
//#endregion
//#region userInput
process.stdin.on('keypress', async function(c, key) {
    if (process.argv[2] == "launch") {
        if (outputWritten && !answer) {
            clearBar()
            reWriteCommandText()
            setoutputWritten(false)
        } else if (answer) {
            if (key.name == 'y') {
                answer(true)
            } else {
                answer(false)
            }

            clearBar()
            reWriteCommandText()
            setoutputWritten(false)
            return
        }

        if (key.name == "return") {
            clearBar()
            moveCursorPos(0,0)
            isTypingCommand = false
            processCommand(command)
            command = ""
        } else {
            if (!isTypingCommand) {
                if (key.name == "left") {
                    restartSong()
                } else if (key.name == "right") {
                    listContinue(true)
                } else {
                    isTypingCommand = true
                    moveCursorPos(1, commandString)
                    process.stdout.write(getThemeEscapeCode('commandBar') + '>')
                }
            }

            if (key.name == "space") {
                command += " "
                process.stdout.write(" ")                
            } else if (key.sequence != "\b") {
                if (RegExp(/^\p{L}/,'u').test(key.sequence) || parseInt(key.sequence) || key.sequence === "0") {
                    if (command.length < widthChars - 3) {
                        command += key.sequence
                        process.stdout.write(key.sequence)
                    } else {
                        command += key.sequence
                    }
                }                
            } else if (command != "" && key.sequence == "\b") {
                if (command.length < widthChars - 3) {
                    process.stdout.write("\b \b")
                }
                command = command.substring(0, command.length -1)
            } else if (command == "") {
                clearBar()
                command = ""
                moveCursorPos(0,0)
                isTypingCommand = false    
            }
        }
    }
})
//#endregion
