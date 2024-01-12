const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const ytdl = require('ytdl-core');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

// Placeholder

app.get('/api', (req, res) => {
res.json({ message: 'oa'});
});

// ytdl route

app.get('/api/downloadYoutubeVideoAudio', async function(req,res, next){

try{

let info = await ytdl.getInfo(req.query.url)

let format = ytdl.chooseFormat(info.formats, {quality: 'highestaudio'});
let videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, '');

console.table([{
'Video Title': videoTitle,
'Author': info.videoDetails.author.name,
'iframeURL': info.videoDetails.embed.iframeUrl,
'videoId': info.videoDetails.videoId,
'description': info.videoDetails.description
}]);

console.log(`The file being written in ${path.join(__dirname, `./${videoTitle}.mp3`)}`);

ytdl.downloadFromInfo(info, {format: format})
.pipe(fs.createWriteStream(`./${videoTitle}.mp3`)
.on('finish', ()=> {
console.log('The video download was successful');
res.download(`./${videoTitle}.mp3`, function(err){
if(err) next(err)
else {
fs.unlink(`./${videoTitle}.mp3`, function(err){
if(err)throw err 
        });
        }}
    )}
));


}
catch(err){
next(err)
}
}); 

app.get('/api/getVideoInfo', async function(req,res, next){

try{
// Validating the url

if(await !ytdl.validateID(ytdl.getVideoID(req.query.url)) || await !ytdl.validateURL(req.query.url)){
res.send(false)
return
}
// Fetching the video data

const info = await ytdl.getInfo(req.query.url);

res.send(info)
}catch(err){
next(err)
}
}); 
// Error Handling Middleware
app.use((err, req, res, next) => {

let errorName;

const Errors = {
// ytdl-core Errors
'No Video': 'YoutubeVideoNotFoundError',
'Video unavailable': 'YoutubeVideoUnavailableError',
'Video id': 'YoutubeVideoIdError',
'video is unavailable': 'YoutubeVideoUnavailableError',
// Network Errors
'ECONNREFUSED': 'ConnectionRefusedError',
'ETIMEDOUT': 'ServerTimeoutError'
}

for(let [key, value] of Object.entries(Errors)){
if(err.message.includes(key)){
errorName = value;
break
} else {
errorName = 'ServerError'
}
};

console.error(err);

res.status(500).send({error: errorName});
});

app.listen(PORT, () => {
console.log(`Server listen at: ${PORT} port`);
});