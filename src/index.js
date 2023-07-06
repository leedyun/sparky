import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Youtube from "./service/youtube";
import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: { key: process.env.AIzaSyBzQ54f3UEtxQZC_jT54Nyb6U5iEK978lM },
});
const youtube = new Youtube(httpClient);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App youtube={youtube} />
  </React.StrictMode>
);
