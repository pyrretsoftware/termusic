import readline from 'readline';
import process from 'process';

import { processCommand } from '../../helpers/commandProcessor.js';
import { getCrossPlatformString } from '../../helpers/crossPlatformHelper.js';
import { listContinue, restartSong } from '../../helpers/listManager.js';
import { killAudioProcesses } from '../../snippets/player.js';

import { centerText } from '../utils/centerText.js';
import { moveCursorPos } from '../utils/moveCursorPos.js';
import { clearBar } from '../utils/clearBar.js';
import { currentSongReport, outputWritten, setoutputWritten } from '../../helpers/playStatus.js';
import { Reset } from '../../helpers/colorCodes.js';
import { getThemeEscapeCode } from '../themes.js';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);   
}
process.stdout.on('resize', () => {
    process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))      
}); 

const startString = 1
const commandString = 4
const heightChars = 5
const widthChars = 46

let command = ""
let isTypingCommand = false

//#region playerMetadata
export async function updateProgressBar(steps) { //steps/30
    moveCursorPos(38, startString +1)
    process.stdout.write('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b')
    process.stdout.write(`\x1b[1m${getThemeEscapeCode('progressBar')}` + `──────────────────────────────`.slice(0, steps) + `${Reset}\x1b[2m${getThemeEscapeCode('progressBar')}` + '──────────────────────────────'.slice(steps) + '\x1b[0m')
    
    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
    } else {
        moveCursorPos(0, 0)
    }
}
export function setSongDuration(dur1, dur2) {
    moveCursorPos(7, startString + 1)
    process.stdout.write('\b\b\b\b')
    process.stdout.write(getThemeEscapeCode('songTitle') + dur1)

    moveCursorPos(43, startString + 1)
    process.stdout.write('\b\b\b\b')
    process.stdout.write(dur2 + Reset)

    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
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
let currentSongIndex2 = 0; //this is a horrible way of doing this..

let publicForIndexSongDuration = 0
export async function startSongDurationMoving(songlength) {
    currentSongIndex2++
    let  _currentSongIndex = currentSongIndex2
    for (let i = 0; i < songlength +1; i++) {
        publicForIndexSongDuration  = i
        if (currentSongIndex2 != _currentSongIndex) {
            return
        }
        setSongDuration((i - (i % 60)) / 60 + ":" + (i % 60).toString().padStart(2, '0'), (songlength - (songlength % 60)) / 60 + ":" + (songlength % 60).toString().padStart(2, '0'))
        await new Promise(resolve => setTimeout(resolve,  1000));
    }
    setSongDuration("0:00", "0:00")
}
let currentSongIndex = 0; //this is a horrible way of doing this..

let publicForIndex = 0 //another horrible way of doing this
export async function startProgressBarMoving(length) {
    currentSongIndex++
    let  _currentSongIndex = currentSongIndex
    for (let i = 0; i < 30; i++) { 
        publicForIndex = i
        if (currentSongIndex != _currentSongIndex) {
            return
        }
        updateProgressBar(i)
        await new Promise(resolve => setTimeout(resolve, (length / 30) * 1000));
    }

    //we have reached the end of the song
    listContinue()
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
        process.stdout.write(" >" + command)
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
    setSongDuration((publicForIndexSongDuration - (publicForIndexSongDuration % 60)) / 60 + ":" + (publicForIndexSongDuration % 60).toString().padStart(2, '0'), (songInfo['length'] - (songInfo['length'] % 60)) / 60 + ":" + (songInfo['length'] % 60).toString().padStart(2, '0'))
    updateProgressBar(publicForIndex)
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText(process.argv[3] == 'debug' ? mediaComponents["mediaComponent"] : getCrossPlatformString("mediaComponents"), widthChars) + Reset)
}

//#region userInput
process.stdin.on('keypress', async function(c, key) {
    if (process.argv[2] == "launch") {
        if (outputWritten) {
            clearBar()
            reWriteCommandText()
            setoutputWritten(false)
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
                    process.stdout.write('>')
                }
            }

            if (key.name == "space") {
                command += " "
                process.stdout.write(" ")                
            } else if (key.sequence != "\b") {
                if (RegExp(/^\p{L}/,'u').test(key.sequence) || parseInt(key.sequence) || key.sequence === "0") {
                    command += key.sequence
                    process.stdout.write(key.sequence)
                }                
            } else if (command != "" && key.sequence == "\b") {
                process.stdout.write("\b \b")
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