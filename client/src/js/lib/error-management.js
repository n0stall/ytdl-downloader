import isURL from 'is-url'

class InvalidVideoUrlError  extends Error { 
constructor(message){
super(message)
this.name = 'InvalidVideoUrlError';
this.message = message;
this.stack = '';
    }
}

class YoutubeVideoNotFoundError extends Error { 
constructor(message){
super(message)
this.name = 'YoutubeVideoNotFoundError';
this.message = message;
this.stack = '';
    }
}

class ServerError extends Error { 
constructor(message){
super(message)
this.name = 'ServerError';
this.message = message;
this.stack = '';
    }
}

class ServerTimeoutError  extends Error { 
constructor(message){
super(message)
this.name = 'ServerTimeoutError ';
this.message = message;
this.stack = '';
    }
}

// Error handling functions

export function fetchWithTimeout(resource, options, timeout = 5000){
const timeoutError = new ServerTimeoutError('The server took too long to get the video data. This is due to internal problems. Please try again later.');

return Promise.race([
fetch(resource,options), 
new Promise((_, reject) =>
setTimeout(() => reject(timeoutError), timeout)
)
])
}

export function validateURL(url){
if(!url){
throw new InvalidVideoUrlError('The field for the video URL is empty. Please enter a URL.')
}
if(!isURL(url)){
throw new InvalidVideoUrlError('The URL provided is invalid or not in the correct format.')
}
}

export const fetchErrorHandler = {
'YoutubeVideoNotFoundError': ()=>{
throw new YoutubeVideoNotFoundError('YouTube video not found. Please check the URL and try again.')
},
'YoutubeVideoUnavailableError': ()=>{
throw new YoutubeVideoNotFoundError('The YouTube video is not available. It may have been removed or is not accessible in your region.')
},
'YoutubeVideoIdError': ()=>{
throw new YoutubeVideoNotFoundError('Error in the YouTube video ID. Please verify that the video ID is correct.')
},
'ConnectionRefusedError': ()=>{
throw new ServerError('Connection refused error. Please check your internet connection and try again.')
},
'ServerTimeoutError': ()=>{
throw new ServerTimeoutError('The server took too long to get the video data. This is due to internal problems. Please try again later.')
},
'ServerError': ()=>{
throw new ServerError('The Server has had a problem getting the video data. Check the url for syntax errors and try again.')
},
}
