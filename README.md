# <img src="https://github.com/pyrretsoftware/termusic/raw/main/images/icon.png" width="32"/> termusic

A minimal and lightweight terminal music player. Uses the cobalt api and ffplay to stream and play audio from youtube.

Termusic is designed to sit in the corner of your screen while you work, study, or play video games, while taking up as little screen real estate as possible.
# Getting started!
First, make sure you have node.js version **18** or later, [npm](https://npmjs.org), aswell as [ffmpeg](https://ffmpeg.org) installed on your system.

After that, you can install termusic via npm by running the following command:

```
npm i -g termusic
```

[More info on installation](https://github.com/pyrretsoftware/termusic/wiki/Installing-termusic)
# Using termusic
After installing, enter ``termusic`` in your terminal. It will open up a new terminal window.

Start typing on your keyboard to enter a command. Here's a few basic commands, [but there are over 15 commands!](https://github.com/pyrretsoftware/termusic/blob/main/commands.md):
- ``play <song name>`` - searches up a song and starts playing it.
- ``queue add <song name>`` - searches up a song and adds it to the queue
- ``volume <volume percent>`` - sets the volume, a value from 0 to 100.
- ``theme <theme>`` - applies a theme given its name. You can view your themes in the ./ui/themes folder.
- ``pl <playlist>`` - searches for a playlist and adds all of its songs to the queue.

You can also use the right and left arrow keys to restart or skip songs.
