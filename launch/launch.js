import { displayPlayUi } from '../ui/uiManagers/player.js';
import { changeProgramTitleStatus } from '../helpers/player/programTitle.js'
import { startAudioServer } from '../helpers/core/playAudio.js';

export function launch() {
    changeProgramTitleStatus('idling')

    setInterval(function() {}, 1000 * 60 * 60);
    console.clear()
    if (process.argv[3] != "debug") {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))
    }
    startAudioServer()
    displayPlayUi("no song playing")
}