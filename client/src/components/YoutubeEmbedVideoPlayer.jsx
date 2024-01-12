export default function YoutubeEmbedVideoPlayer({src}){
return(<iframe 
    className='video-embed-frame' 
    src={src}
    frameBorder='0'
    title='YouTube video player'
    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    allowFullScreen>
    </iframe>)
}