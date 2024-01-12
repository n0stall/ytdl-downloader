import { useState, useRef } from 'react'
import {validateURL, fetchWithTimeout, fetchErrorHandler } from './js/lib/error-management'
import Loader from './components/Loader'
import YoutubeEmbedVideoPlayer from './components/YoutubeEmbedVideoPlayer'
import './css/App.css'

function App() {

const VITE_APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL

// Referencing the video url input 

const URLRef = useRef(null)

// Loader 

const [loaderState, setLoaderState] = useState({    
visible: false,
message: 'Loading'
})

// Video Embed URL State

const [videoData, setVideoData] = useState({})

const [downloadFrameURL, setDownloadFrameURL] = useState('')

async function handleVideoDataFetch(){

try{

validateURL(URLRef.current.value)

// Updating the loading message

setLoaderState({
message: 'Fetching Data',
visible: true
})

const videoDataResponse = await fetchWithTimeout(`${VITE_APP_SERVER_URL}/getVideoInfo?url=${URLRef.current.value}`,{},1000 * 60 * 15)
const videoDataJSON = await videoDataResponse.json()
setVideoData(videoDataJSON)

if(videoDataJSON.error){
console.error(videoDataJSON);
fetchErrorHandler[videoDataJSON.error]();
} 
setDownloadFrameURL(`${VITE_APP_SERVER_URL}/downloadYoutubeVideoAudio?url=${URLRef.current.value}`)

setLoaderState({
message: 'Downloading Data',
visible: true
})

await fetchWithTimeout(`${VITE_APP_SERVER_URL}/downloadYoutubeVideoAudio?url=${URLRef.current.value}`,{},1000 * 60 * 30)

setLoaderState({
message: '',
visible: false
})

} 
// If Error
catch(err){

if(!err.message.includes('Failed to fetch')){
alert(`${err.name}: ${err.message}`)
console.error(`${err.name}: ${err.message}`)
} else {
fetchErrorHandler['ServerError']()
console.error(`ServerError: An unexpected server error has occurred.`)
}

setDownloadFrameURL('')
setVideoData({})
setLoaderState({
message: '',
visible: false
})
return
}
}

return (
<div className='main'>
<Loader state={loaderState}/>
<div className='app'>
<iframe src={downloadFrameURL ? downloadFrameURL : ''} className='download-frame'></iframe>
<div className='app-header'>
<h2 className='app-title'>Youtube Mp3 Downloader</h2>
</div>
<p className='app-description'>
A basic Youtube Mp3 Downloader using React, Node.js, Express and ytdl-core library
</p>
<div className='url-form'>
<button className='url-form__btn' onClick={handleVideoDataFetch}>Get Video</button>
<input
ref={URLRef}
type='url'
placeholder='https://www.youtube.com/watch?v=a90QFNiPMH0'
className='url-form__input'
onKeyDown={(e)=> {
if(e.key === 'Enter' && e.target.value.length > 0){
handleVideoDataFetch()
return
}else{
return
}
}}/>
</div>
{videoData.videoDetails ? 
<YoutubeEmbedVideoPlayer src={videoData.videoDetails ? videoData.videoDetails.embed.iframeUrl : ''}/>
: ''
}
</div></div>)
}

export default App
