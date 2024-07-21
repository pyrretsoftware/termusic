import readline from 'readline';
import process from 'process';

import { processCommand } from '../../helpers/commandProcessor.js';
import { getCrossPlatformString } from '../../helpers/crossPlatformHelper.js';
import { listContinue } from '../../helpers/listManager.js';
import { killAudioProcesses } from '../../snippets/player.js';

import { centerText } from '../utils/centerText.js';
import { moveCursorPos } from '../utils/moveCursorPos.js';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);   
}

const startString = 1
const commandString = 4
const heightChars = 5
const widthChars = 46

let command = ""
let isTypingCommand = false


//#region playerMetadata
function clearBar() {
    moveCursorPos(45, commandString)
    for (let i = 0; i < 45; i++) {
        process.stdout.write('\b \b')
    } 
}
export async function updateProgressBar(steps) { //steps/30
    moveCursorPos(38, startString +1)
    process.stdout.write('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b')
    process.stdout.write('\x1b[1m' + '──────────────────────────────'.slice(0, steps) + "\x1b[0m\x1b[2m" + '──────────────────────────────'.slice(steps) + '\x1b[0m')
    
    if (isTypingCommand) {
        moveCursorPos(command.length + 3, commandString)
    } else {
        moveCursorPos(0, 0)
    }
}
export function setSongDuration(dur1, dur2) {
    moveCursorPos(7, startString + 1)
    process.stdout.write('\b\b\b\b')
    process.stdout.write(dur1)

    moveCursorPos(43, startString + 1)
    process.stdout.write('\b\b\b\b')
    process.stdout.write(dur2)

    if (isTypingCommand) {
        moveCursorPos(command.length + 3, commandString)
    } else {
        moveCursorPos(0, 0)
    }
}
function changePlayState(state) {
    moveCursorPos(23, startString + 2)
    process.stdout.write('\b' + state ? '▶️' : '⏸️')
}
export function setSongTitle(title) {
    moveCursorPos(widthChars, startString)
    for (let i = 0; i < widthChars; i++) {
        process.stdout.write("\b \b")
    }
    process.stdout.write("\x1b[1m" +centerText(title, widthChars) + "\x1b[0m")

    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
    } else {
        moveCursorPos(0, 0)
    }
}
let currentSongIndex2 = 0; //this is a horrible way of doing this..
export async function startSongDurationMoving(songlength) {
    currentSongIndex2++
    let  _currentSongIndex = currentSongIndex2
    for (let i = 0; i < songlength +1; i++) {
        if (currentSongIndex2 != _currentSongIndex) {
            return
        }
        setSongDuration((i - (i % 60)) / 60 + ":" + (i % 60).toString().padStart(2, '0'), (songlength - (songlength % 60)) / 60 + ":" + (songlength % 60).toString().padStart(2, '0'))
        await new Promise(resolve => setTimeout(resolve,  1000));
    }
}
let currentSongIndex = 0; //this is a horrible way of doing this..
export async function startProgressBarMoving(length) {
    currentSongIndex++
    let  _currentSongIndex = currentSongIndex
    for (let i = 0; i < 30 +1; i++) { 
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
    "progressBar" : "{0} ────────────────────────────── {1}" //30 lines
}
export async function displayPlayUi(title) {
    moveCursorPos(0, startString)
    process.stdout.write("\x1b[1m" +centerText(title, widthChars) + "\x1b[0m")
    moveCursorPos(0, startString +1)
    process.stdout.write(centerText(mediaComponents["progressBar"].replace("{0}", "0:00").replace("{1}", "0:00"), widthChars))
    moveCursorPos(0, startString +2)
    process.stdout.write(centerText(getCrossPlatformString("mediaComponents"), widthChars))
}
//#endregion
//#region userInput
process.stdin.on('keypress', async function(c, key) {
    if (key.ctrl && key.name == "c") {
        killAudioProcesses()
        process.exit(0)
    }
    if (process.argv[2] == "launch") {
        if (key.name == "return") {
            clearBar()
            moveCursorPos(0,0)
            isTypingCommand = false
            processCommand(command)
            command = ""
        } else {
            if (!isTypingCommand) {
                isTypingCommand = true
                moveCursorPos(1, commandString)
                process.stdout.write('>')
            }

            if (key.sequence != "\b" && key.name) {
                command += key.name.replace("space", " ")
                
                process.stdout.write(key.name.replace("space", " "))                
            } else if (command != "") {
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