const statuses = {
    'radio' : 'listening to radio',
    'playing' : 'listening to music',
    'idling' : 'idling',
}

export async function changeProgramTitleStatus(status) {
    if (statuses[status]) {
        process.stdout.write(String.fromCharCode(27) + "]0;termusic - " + statuses[status] + String.fromCharCode(7));
    }
}