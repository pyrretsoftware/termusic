# <img src="https://github.com/pyrretsoftware/termusic/raw/main/images/icon.png" width="32"/> termusic

A minimal and lightweight terminal music player. Uses the invidious api, the cobalt api and ffplay to stream and play audio from youtube.
# Getting started!
First, make sure you have node.js version **18** or later, [npm](https://npmjs.org), aswell as [ffmpeg](https://ffmpeg.org) installed on your system.

After that, you can install termusic via npm by running the following command:

```
npm i -g termusic
```
# Using termusic
After installing, enter ``termusic`` in your terminal. It will open up a new terminal window.

Start typing on your keyboard to enter a command. Here's a list of commands you can run:
- ``play <song name>`` - searches up a song and starts playing it.
- ``queue add <song name>`` - searches up a song and adds it to the queue
- ``queue remove`` - removes the last song from the queue
- ``queue clear`` - clears the queue
- ``queue skip`` - skips to the next song in the queue
- ``exit`` - exits the program.
- ``volume <volume percent>`` - sets the volume, a value from 0 to 100.
- ``loop`` - enables looping, ignoring the queue and looping the current song.
- ``noloop`` - disables looping.
- ``theme <theme>`` - applies a theme given its name. You can view your themes in the ./ui/themes folder.
- ``share`` - copies a sharable link to the song your listening to.
- ``reloadui`` - reloads the ui, mainly useful for debugging.
- ``about`` - shows an about dialog.


You can also use the right and left arrow keys to restart or skip songs.
