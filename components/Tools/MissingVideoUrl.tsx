import { useChatProvider } from "@/providers/ChatProvider";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MissingVideoUrl = () => {
  const { question } = useToolCallProvider();
  const [videoUrl, setVideoUrl] = useState("");
  const { append } = useChatProvider();

  const handleSubmit = async () => {
    append({
      id: uuidV4(),
      content: `${question as string}. Video URL: ${videoUrl}`,
      role: "user",
    });
  };

  return (
    <div>
      <p className="text-sm pb-3">Please provide the video url to proceed.</p>
      <fieldset className="flex gap-2 items-center">
        <input
          type="text"
          onChange={(e) => setVideoUrl(e.target.value)}
          className="!bg-transparent border-gray-700 border-[1px] rounded-md !outline-none px-2 py-1 text-sm"
          placeholder="Input TikTok video url."
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
        >
          Submit
        </button>
      </fieldset>
    </div>
  );
};

export default MissingVideoUrl;
