import { Green, Reset } from "../../helpers/misc/colorCodes.js";
import { moveCursorPos } from "../utils/moveCursorPos.js";
import fs from 'fs'

import { fileURLToPath } from "url";
import path from "path";
import { clearBar } from "../utils/clearBar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function showHelp() {
    process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", "4").replaceAll("w", "50"))
    moveCursorPos(2, 1)
    process.stdout.write(`\x1b[4mCommands:${Reset}`)
    moveCursorPos(2, 3)
    process.stdout.write(`\x1b[2mFetching command definitions...${Reset}`)
    
    const file = fs.readFileSync(path.join(__dirname, '../', '../', 'commands.md'), 'utf8').split('\n')[0]
    const regex = /- ``(.*)`` - (.*)/
    clearBar()
    
    let longestDefintion = 0
    for (let i = 0; i < file.length; i++) { //we have to do a double for loop here because some terminals behave differently
        const match = file[i].match(regex)
        console.log(file)
        if (match[2].length > longestDefintion) {
            longestDefintion = match[2].length
        }
    }

    process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", (file.length + 4).toString()).replaceAll("w", (longestDefintion + 28).toString()))
    process.stdout.on('resize', () => {
        process.stdout.write(`${String.fromCharCode(0o33)}[8;h;wt`.replaceAll("h", (file.length + 4).toString()).replaceAll("w", (longestDefintion + 28).toString()))        
    }); 

    for (let i = 0; i < file.length; i++) {
        const match = file[i].match(regex)
        moveCursorPos(2, i + 3)
        process.stdout.write(`${Green}${match[1]}${Reset}`)
        moveCursorPos(27, i + 3)
        process.stdout.write(`${match[2]}${Reset}`)
    }

}