import { showHelp } from "../ui/uiManagers/help.js";

export function launchHelp() {
    process.stdout.write(String.fromCharCode(27) + "]0;help - termusic" + String.fromCharCode(7));
    showHelp()
}