import React, {useCallback, memo} from 'react';
import styles from './app.module.css';

const VideoItem = memo(
    ({video, video:{snippet}, onVideoClick,display})=> {
        const displayType = display ==='list'? styles.list:styles.grid;
        const onClick = useCallback(()=> {
            onVideoClick(video);
        }, [onVideoClick, video])
        return (
            <>
            <li className={`${styles.container} ${displayType}`} onClick={onClick}>
          <div className={styles.video}>
            <img
              className={styles.thumbnail}
              src={snippet.thumbnails.medium.url}
              alt="video thumbnail"
            />
            <div className={styles.metadata}>
              <p className={styles.title}>{snippet.title}</p>
              <p className={styles.channel}>{snippet.channelTitle}</p>
            </div>
          </div>
          </li>
      </>
    );
  },
);

export default VideoItem;