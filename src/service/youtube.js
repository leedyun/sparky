const youtube = async (httpClient, channelId) => {
  const playlistResponse = await httpClient.get("channels", {
    params: {
      part: "contentDetails",
      id: channelId,
    },
  });

  const uploadsPlaylistId =
    playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  const videosResponse = await httpClient.get("playlistItems", {
    params: {
      part: "snippet",
      playlistId: uploadsPlaylistId,
    },
  });
  return videosResponse.data.items;
};

export default youtube;
