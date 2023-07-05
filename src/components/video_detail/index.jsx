import React from 'react';

const VideoDetail =({video}) => {
    return (
        <div>
            <iframe
            title="youtube video player"
            type="text/html"
            width="100%"
            height="500px"
            src={'https://www.youtube.com/embed/${video.id'}
            allowFullScreen />
            <h2>{video.snippet.title}</h2>
            <h3>{video.snippet.channelTitle}</h3>
            <pre>{video.snippet.description}</pre>
            </div>
    )
}

export default VideoDetail;