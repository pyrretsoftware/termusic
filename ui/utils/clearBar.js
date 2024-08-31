import { Reset } from "../../helpers/misc/colorCodes.js"
import { moveCursorPos } from "./moveCursorPos.js"

export function clearBar(line = 4) {
    moveCursorPos(45, line)
    process.stdout.write(Reset + ' ')
    for (let i = 0; i < 45; i++) {
        process.stdout.write('\b \b')
    } 
}