/*
termusic/helpers/ffmpegConvert.js

Written by axell (mail@axell.me) for pyrret software.
*/

const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs");
const path = require('path');
const crypto = require("crypto")
const crossPlatformHelper = require("./crossPlatformHelper")

async function convertVideo(url, output, callback) {
    if (!fs.existsSync(path.join(__dirname, "../","temp"))) {
        fs.mkdirSync(path.join(__dirname, "../","temp"))
    }

    const videoId = crypto.randomBytes(20).toString('hex');
    const writeStream = fs.createWriteStream(path.join(__dirname, "../","temp", videoId + ".mp4"))

    writeStream.pipe((await (await fetch(url)).arrayBuffer()))
    await new Promise((resolve) => {writeStream.on('finish', resolve)})
    writeStream.close();

    const audioId = crypto.randomBytes(20).toString('hex');
    ffmpeg(path.join(__dirname, "../", "temp", videoId + ".mp4")).output(path.join(__dirname, "../", "temp", audioId + `.${crossPlatformHelper.getCrossPlatformString("best-audio-format")}`))
        .on('end', ffmpegFinished).on('error', function(err){
            console.log('FFMPEG Error: ', e.code, e.msg);
            process.exit()
        }).run();

    await new Promise((resolve) => {
        
    })
}

convertVideo('./df.mp4', './output.mp3', function(err){
   if(!err) {
       console.log('conversion complete');
       //...

   }
});