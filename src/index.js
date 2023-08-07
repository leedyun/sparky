import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import youtube from "./service/youtube"; // 클래스 대신 함수를 가져옴
import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: { key: process.env.AIzaSyBzQ54f3UEtxQZC_jT54Nyb6U5iEK978lM },
});
// 서로 다른 도메인(크로스 도메인)에 요청을 보낼 때 요청에 authorization 정보를 담아서 보낼지
httpClient.defaults.withCredentials = true;
httpClient.defaults.headers.common["SameSite"] = "None";
httpClient.defaults.headers.common["Secure"] = true;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App youtube={youtube} httpClient={httpClient} />
  </React.StrictMode>
);
