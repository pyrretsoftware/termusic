import { moveCursorPos } from "./moveCursorPos.js"

export function clearBar() {
    moveCursorPos(45, 4)
    process.stdout.write(' ')
    for (let i = 0; i < 45; i++) {
        process.stdout.write('\b \b')
    } 
}