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
  const [accessToken, setAccessToken] = useState("");

  const selectVideo = (video) => {
    setSelectedVideo(video);
  };

  useEffect(() => {
    authenticate();
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

  useEffect(() => {
    handleAuthorization();
  }, []);

  const handleAuthorization = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    }
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
        const { access_token } = response.data;
        setAccessToken(access_token); // 액세스 토큰 저장
        fetchChannelVideos(access_token);
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
      .get(CHANNELS_ENDPOINT, {
        headers,
        params: {
          part: "contentDetails",
          mine: true,
          key: API_KEY,
        },
      })
      .then((response) => {
        const { items } = response.data;
        if (items.length === 0) {
          console.error("No channel found.");
          return;
        }

        const uploadsPlaylistId =
          items[0].contentDetails.relatedPlaylists.uploads;
        fetchPlaylistVideos(uploadsPlaylistId, accessToken);
      })
      .catch((error) => {
        console.error("Error fetching channel videos:", error);
      });
  };

  const fetchPlaylistVideos = (playlistId, accessToken) => {
    axios
      .get("https://www.googleapis.com/youtube/v3/playlistItems", {
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: MAX_RESULTS,
          key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { items } = response.data;
        setVideos(items || []);
      })
      .catch((error) => {
        console.error("Error fetching playlist videos:", error);
      });
  };

  return (
    <div className={styles.app}>
      <section className={styles.content}>
        {selectedVideo && (
          <div className={styles.detail}>
            <VideoDetail video={selectedVideo} />
          </div>
        )}
        <div className={styles.list}>
          <VideoList
            videos={videos}
            onVideoClick={selectVideo}
            display={selectedVideo ? "list" : "grid"}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
