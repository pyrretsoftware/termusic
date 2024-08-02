import { setPlayStatus } from '../helpers/playStatus.js';
import { displayPlayUi } from '../ui/uiManagers/player.js';

export function launch() {
    setInterval(function() {}, 1000 * 60 * 60);
    console.clear()
    if (process.argv[3] != "debug") {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "5").replaceAll("w", "46"))
    }
    displayPlayUi("no song playing")
}