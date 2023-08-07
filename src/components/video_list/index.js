import React from "react";
import VideoItem from "../video_item/index";

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <ul style={{ listStyleType: "none" }}>
      {videos.map((video) => (
        <VideoItem key={video.id} video={video} onVideoClick={onVideoClick} />
      ))}
    </ul>
  );
};

export default VideoList;
