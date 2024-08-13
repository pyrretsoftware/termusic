import { showAbout } from "../ui/uiManagers/about.js";

export function launchAbout() {
    process.stdout.write(String.fromCharCode(27) + "]0;about - termusic" + String.fromCharCode(7));
    process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "15").replaceAll("w", "73"))
    showAbout()
}