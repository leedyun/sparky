import React, { useEffect, useState } from "react";
import styles from "./app.module.css";
import VideoList from "./components/video_list";
import VideoDetail from "./components/video_detail";
import axios from "axios";

const CLIENT_ID =
  "721514704621-fevrsjdpu7ourl3dtc6nd5dd1o2nfukv.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000";
const API_KEY = "AIzaSyBzQ54f3UEtxQZC_jT54Nyb6U5iEK978lM";
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const CHANNELS_ENDPOINT = "https://www.googleapis.com/youtube/v3/channels";
const MAX_RESULTS = 10;

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const selectVideo = (video) => {
    setSelectedVideo(video);
  };

  useEffect(() => {
    // 엑세스 토큰 불러오기(로컬스토리지 : 사용자가 인증 후 저장)
    const storedAccessToken = localStorage.getItem("accessToken");

    // 유효성 검사
    if (storedAccessToken && !isTokenExpired(storedAccessToken)) {
      fetchChannelVideos(storedAccessToken);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        // 토큰이 만료된 경우
        fetchAccessToken(code);
      } else {
        // 인증이 필요한경우
        authenticate();
      }
    }
  }, []);

  const authenticate = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      response_type: "code",
    });
    window.location.href = `${AUTH_ENDPOINT}?${params}`;
  };

  const fetchAccessToken = (code) => {
    const data = {
      code,
      client_id: CLIENT_ID,
      client_secret: "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",
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    };

    axios
      .post(TOKEN_ENDPOINT, data)
      .then((response) => {
        const { access_token, expires_in } = response.data;
        const expirationTime = Math.floor(Date.now() / 1000) + expires_in;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("expirationTime", expirationTime);
        window.location.href = REDIRECT_URI;
      })
      .catch((error) => {
        console.error("Error fetching access token:", error);
      });
  };

  const fetchChannelVideos = (accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get("https://www.googleapis.com/youtube/v3/channels", {
        headers,
        params: {
          part: "snippet",
          mine: true,
          key: API_KEY,
        },
      })
      .then((response) => {
        const { items } = response.data;

        if (items.length > 0) {
          const channelId = items[0].id;
          fetchVideos(channelId, accessToken);
        }
      })
      .catch((error) => {
        console.error("Error fetching channel videos:", error);
      });
  };

  const fetchVideos = (channelId, accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get(CHANNELS_ENDPOINT, {
        headers,
        params: {
          part: "contentDetails",
          id: channelId,
          key: API_KEY,
        },
      })
      .then((response) => {
        const { items } = response.data;

        if (items.length > 0) {
          const uploadsPlaylistId =
            items[0].contentDetails.relatedPlaylists.uploads;
          fetchPlaylistVideos(uploadsPlaylistId, accessToken);
        }
      })
      .catch((error) => {
        console.error("Error fetching channel videos:", error);
      });
  };

  const fetchPlaylistVideos = (playlistId, accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get("https://www.googleapis.com/youtube/v3/playlistItems", {
        headers,
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: MAX_RESULTS,
          key: API_KEY,
        },
      })
      .then((response) => {
        const { items } = response.data;
        setVideos(items);
        setSelectedVideo(items[0]); // 선택된 동영상을 첫 번째 동영상으로 설정
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  };

  const isTokenExpired = (token) => {
    const expirationTime = localStorage.getItem("expirationTime");
    return Date.now() / 1000 >= expirationTime;
  };

  return (
    <div className={styles.app}>
      {selectedVideo ? (
        <div>
          <h1>YouTube Video List</h1>
          <div className={styles.container}>
            <VideoDetail video={selectedVideo} />
            <VideoList videos={videos} onVideoClick={selectVideo} />
          </div>
        </div>
      ) : (
        <button onClick={authenticate}>Authenticate</button>
      )}
    </div>
  );
}

export default App;
