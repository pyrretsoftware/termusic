export function launchConnectedConsole() {
    process.stdout.write(String.fromCharCode(27) + "]0;termusic.connectedConsole" + String.fromCharCode(7));

    process.stdin.on('data', (message) => {
        process.stdout.write(message)
    })
}