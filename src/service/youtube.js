class Youtube {
  constructor(httpClient) {
    this.youtube = httpClient;
  }

  async getChannelVideos(channelId) {
    const playlistResponse = await this.youtube.get("channels", {
      params: {
        part: "contentDetails",
        id: channelId,
      },
    });

    const uploadsPlaylistId =
      playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    const videosResponse = await this.youtube.get("playlistItems", {
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
      },
    });
    return videosResponse.data.items;
  }
}

export default Youtube;
