import React, { useCallback, memo } from "react";

const VideoItem = memo(({ video, video: { snippet }, onVideoClick }) => {
  const onClick = useCallback(() => {
    onVideoClick(video);
  }, [onVideoClick, video]);

  return (
    <>
      <li onClick={onClick}>
        <div className="video">
          <img
            className="thumbnail"
            src={snippet.thumbnails.medium.url}
            alt="video thumbnail"
          />
          <div className="metadata">
            <p className="title">동영상 제목 : {snippet.title}</p>
          </div>
        </div>
      </li>
    </>
  );
});

export default VideoItem;
