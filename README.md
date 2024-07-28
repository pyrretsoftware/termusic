# termusic
![image](https://raw.githubusercontent.com/pyrretsoftware/termusic/main/images/carbon.png)

A minimal and lightweight terminal music player.
## What is termusic?
Termusic is a utility for playing music from YouTube. It uses the invidious api, the cobalt api and ffplay to stream and play audio.
# Getting started!
> [!IMPORTANT]  
> You need to install ffmpeg in order to use termusic.

Simply install termusic via npm by running

```
npm i -g termusic
```
# Commands
After installing, enter ``termusic`` in your terminal. It will open up a new window.

To play songs, enter the command bar by starting to type on your keyboard. In the command bar you can type different commands:
- ``play <song name>`` - searches up a song and starts playing it.
- ``queue add <song name>`` - searches up a song and adds it to the queue
- ``queue remove`` - removes the last song from the queue
- ``queue clear`` - clears the queue
- ``queue skip`` - skips to the next song in the queue
- ``exit`` - exits the program.
- ``volume <volume percent>`` - sets the volume, a value from 0 to 100.

To exit the command bar, press backspace until the arrow at the start is removed. When your outside the command bar, you can use the arrow keys to skip around.
