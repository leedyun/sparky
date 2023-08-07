const getChannelVideos = (key, channelId) => {
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const channelInfoUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${key}`;

  return fetch(channelInfoUrl, getRequestOptions)
    .then((response) => response.json())
    .then((result) => {
      const uploadsPlaylistId =
        result.items[0].contentDetails.relatedPlaylists.uploads;
      const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=25&key=${key}`;
      return fetch(playlistItemsUrl, getRequestOptions)
        .then((response) => response.json())
        .then((result) => result.items);
    });
};

export default getChannelVideos;
