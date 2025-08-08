import youtubeLoginTool from "./youtubeLogin";
import getYouTubeChannels from "./getYouTubeChannels";
import getYouTubeRevenue from "./getYouTubeRevenue";
import getYouTubeChannelVideoList from "./getYouTubeChannelVideoList";
import setYouTubeThumbnail from "./setYouTubeThumbnail";

const youtubeTools = {
  youtube_login: youtubeLoginTool,
  get_youtube_channels: getYouTubeChannels,
  get_youtube_revenue: getYouTubeRevenue,
  get_youtube_channel_video_list: getYouTubeChannelVideoList,
  set_youtube_thumbnail: setYouTubeThumbnail,
};

export default youtubeTools;
