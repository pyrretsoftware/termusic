//this needs refactoring, mainly better naming.
import readline from 'readline';
import process from 'process';

import { processCommand } from '../../helpers/core/commandProcessor.js';
import { getCrossPlatformString } from '../../helpers/misc/crossPlatformHelper.js';
import { listContinue, restartSong } from '../../helpers/player/listManager.js';

import { centerText } from '../utils/centerText.js';
import { moveCursorPos } from '../utils/moveCursorPos.js';
import { clearBar } from '../utils/clearBar.js';
import { answer, currentSongPlayingReport, currentSongReport, outputWritten, setoutputWritten, setPlayStatus, statusText } from '../../helpers/player/playStatus.js';
import { PastelRed, Reset } from '../../helpers/misc/colorCodes.js';
import { getThemeEscapeCode } from '../themes.js';
import { config } from '../../snippets/config.js';
import { changePlayState, currentlyPLayingAudio } from '../../helpers/core/playAudio.js';

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
const FPS = config['fps']

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
let timingBar = 3
let dur1LengthOffset = 0 
export function performTimingOffsets(dur1, dur2) {
    if (dur2.includes("Live")) {
        dur2 = "Live"
    }

    let offset = Math.floor(((7 - dur1.length) - (7 - dur2.length)) / 2)
    timingBar = 3 - offset

    dur1LengthOffset = dur1.length - 4
}
export async function updateProgressBar(steps) { //steps/30
    moveCursorPos(timingBar + 5, startString +1)
    process.stdout.write(`\x1b[1m${getThemeEscapeCode('progressBar')}` + `──────────────────────────────`.slice(0, steps) + `${Reset}\x1b[2m${getThemeEscapeCode('progressBar')}` + '──────────────────────────────'.slice(steps) + '\x1b[0m')
    
    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar'))
    } else {
        moveCursorPos(0, 0)
    }
}
export let passedTime = 0
let passedTimeBars = 0
export function setSongDuration(dur1, dur2) {
    performTimingOffsets(dur1, dur2)
    clearBar(startString + 1)
    updateProgressBar(passedTimeBars)
    moveCursorPos(timingBar - dur1LengthOffset, startString + 1)
    process.stdout.write(getThemeEscapeCode('songTitle') + dur1)

    moveCursorPos(timingBar + 36, startString + 1)
    process.stdout.write(dur2 + Reset)

    if (isTypingCommand) {
        moveCursorPos(command.length + 2, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar'))
    } else {
        moveCursorPos(0, 0)
    }
}
export function changeUiPlayState(state) {
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText((state ? getCrossPlatformString("mediaComponents") : getCrossPlatformString("mediaComponentsPaused")), widthChars) + Reset)
    moveCursorPos(0,0)
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
export async function startMoving(length) {
    currentSongIndex++
    let  _currentSongIndex = currentSongIndex;
    let startTime = new Date()
    changeUiPlayState(true);

    (async () => {
        for (let i = 0; i < (length ? length * FPS : Infinity); i++) {
            if (!currentlyPLayingAudio['isPlaying']) {
                startTime = new Date(startTime.getTime() + ((1 / FPS) * 1000)) //account for passed time when pausing
                await new Promise(resolve => setTimeout(resolve,  (1 / FPS) * 1000));
                continue
            }

            if (currentSongIndex != _currentSongIndex) {
                return
            }

            const timeDifference = Math.floor((Date.now() - startTime) / 1000)
            const barDifference = timeDifference / (length / 30) //will be NaN if playing radio

            if (passedTimeBars >= 30 && length) {
                break
            }
            if (passedTime != timeDifference && (passedTimeBars != barDifference || !length)) {
                passedTime  = timeDifference
                passedTimeBars = barDifference
    
                setSongDuration(calculateDisplayTime(timeDifference), calculateDisplayTime(length))
    
                if (length) {
                    updateProgressBar(barDifference)
                }   
            }
            await new Promise(resolve => setTimeout(resolve,  (1 / FPS) * 1000));
        }
        passedTimeBars = 0
        passedTime = 0
        setSongDuration("0:00", "0:00")
        listContinue()
    })();
}
export async function displayPlayUi(title) {
    setSongTitle(title)
    setSongDuration('0:00', '0:00')
    updateProgressBar(0)
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText((currentlyPLayingAudio['isPlaying'] ? getCrossPlatformString("mediaComponents") : getCrossPlatformString("mediaComponentsPaused")), widthChars) + Reset)
}

export async function reWriteCommandText() {
    if (isTypingCommand) {
        moveCursorPos(0, commandString)
        process.stdout.write(getThemeEscapeCode('commandBar') + " >" + command + Reset)
    }
}

export function rewriteStatusText() {
    if (!isTypingCommand) {
        moveCursorPos(0, commandString)
        process.stdout.write(statusText)
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
    setSongDuration(calculateDisplayTime(passedTime), calculateDisplayTime(songInfo['length']))
    updateProgressBar(passedTimeBars)
    moveCursorPos(0, startString +2)
    process.stdout.write(getThemeEscapeCode('mediaComponents') + centerText((currentlyPLayingAudio['isPlaying'] ? getCrossPlatformString("mediaComponents") : getCrossPlatformString("mediaComponentsPaused")), widthChars) + Reset)

    if (!outputWritten) {
        reWriteCommandText()
    } else {
        rewriteStatusText()
    }
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
                } else if (key.name == "space" && currentSongPlayingReport) {
                    if (currentlyPLayingAudio['usesLegacyPlayback']) {
                        setPlayStatus('important_err', `Radio can't be paused`)
                    } else {
                        changePlayState()
                    }
                    return
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
                if ((RegExp(/[^\t]/,'u').test(key.sequence) && key.name != 'up' && key.name != 'down' && key.name != 'left' && key.name != 'right') || parseInt(key.sequence) || key.sequence === "0") {
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
