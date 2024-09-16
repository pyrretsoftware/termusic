/*
termusic/helpers/crossPlatformHelper.js

Written by axell (mail@axell.me) for pyrret software.
*/
const crossPlatformStrings = {
//   String                 Windows   Linux
    "new-terminal-window" : ["start conhost.exe --", "xdg-open"],
    "account-for-scrollbar" : [" ", ""],
    "kill-process" : ["taskkill /F /T /PID ", "kill -9 "],
    "mediaComponents" : ["◀◀️▶️▶▶", "◀◀ ▶ ▶▶"],
    "mediaComponentsPaused" : ["◀◀️।।▶▶", "◀◀ ⏸ ▶▶"]
}
export function getCrossPlatformString(string) {
    return crossPlatformStrings[string][process.platform === "win32" ? 0 : 1]
}