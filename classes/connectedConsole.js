import { spawn } from 'child_process'

export class connectedConsole {
    constructor(options) {
        this.consoleProcess = spawn(`${getCrossPlatformString("new-terminal-window")} node ${directory} connectedConsole`, [], {shell: true})

        if (options.title) {
            this.consoleProcess.stdout.write(`\x1b]0;${options.title}\x07`)
        }
    }

    write(message) {
        this.consoleProcess.stdout.write(message)
    }
    close() {
        this.consoleProcess.kill()
    }
}