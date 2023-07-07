import React from 'react';

const VideoDetail = ({ video }) => {
  const videoId = video.snippet.resourceId.videoId;
  const src = `https://www.youtube.com/embed/${videoId}`;

  return video ? (
    <div>
      <iframe
        title="youtube video player"
        type="text/html"
        width="100%"
        height="500px"
        src={src}
        allowFullScreen
      />
      <h2>{video && video.snippet.title}</h2>
      <h2>{videoId}</h2>
      <h3>{video && video.snippet.channelTitle}</h3>
      <pre>{video && video.snippet.description}</pre>
    </div>
  ) : null;
};

export default VideoDetail;