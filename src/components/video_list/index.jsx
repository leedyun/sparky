import React from 'react';
import VideoItem from '../video_item/index';

const VideoList = ({videos, onVideoClick, display})=> {
    return (
        <ul>
            {videos.map((video)=> (
                <VideoItem
                key={video.id}
                video={video}
                onVideoClick={onVideoClick}
                display={display}
            />
            ))}
        </ul>
    )
}

export default VideoList;