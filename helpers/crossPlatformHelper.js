/*
termusic/helpers/crossPlatformHelper.js

Written by axell (mail@axell.me) for pyrret software.
*/
const crossPlatformStrings = {
//   String                 Windows   Linux
    "new-terminal-window" : ["start", "xdg-open"],
    "resize-terminal" : [`\\033[8;{0};{1}t`, `\\033[8;{0};{1}t; resize -s {0} {1}; stty rows {0}; stty cols {1}`],
    "play-audio" : ["powershell -c (New-Object Media.SoundPlayer '{0}').PlaySync();", "aplay {0}"],
    "best-audio-format" : ["wav", "mp3"] //for windows we need to use wav because thats the only format supported but for linux we can use mp3
}
export function getCrossPlatformString(string) {
    return crossPlatformStrings[string][process.platform === "win32" ? 0 : 1]
}