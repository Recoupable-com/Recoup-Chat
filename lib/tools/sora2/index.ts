import generateVideoTool from "./generateVideo";
import retrieveVideoTool from "./retrieveVideo";
import retrieveVideoContentTool from "./retrieveVideoContent";

const sora2Tools = {
  generate_sora_2_video: generateVideoTool,
  retrieve_sora_2_video: retrieveVideoTool,
  retrieve_sora_2_video_content: retrieveVideoContentTool,
};

export default sora2Tools;
