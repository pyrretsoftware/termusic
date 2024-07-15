# termusic
A minimal and lightweight terminal music player.
![image](https://raw.githubusercontent.com/pyrretsoftware/termusic/main/images/carbon.png)
> [!WARNING]  
> Termusic is in a very early stage of development, the code is messy, the application is unstable and its overall a bad experience. I recommend waiting until a stable release before trying termusic out.

## What is termusic?
Termusic is a utility for playing music from YouTube. It uses the invidious api, the cobalt api and ffplay to stream and play audio.
# Getting started!
> [!IMPORTANT]  
> You need to install ffmpeg in order to use termusic.

Simply install termusic via npm by running

```
npm i -g termusic
```

After installing, enter ``termusic`` in your terminal. It will open up a new window.

To play songs, enter the command bar by starting to type on your keyboards. In the command bar you can type different commands:
- ``play <song name>`` - searches up a song and starts playing it.
- ``queue <song name>`` - adds a song to the queue
- ``queue remove`` - removes the last song from the queue
- ``queue clear`` - clears the queue

When your done, press enter on your keyboard and termusic will search up the song and play it. This can take a few seconds.
