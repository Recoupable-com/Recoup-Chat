import Icon from "@/components/Icon";
import { FileRow } from "./types";
import getFileVisual from "@/utils/getFileVisual";

const FileIcon = ({ file }: { file: FileRow }) => {
  const visual = getFileVisual(file.file_name, file.mime_type ?? null);
  return <Icon name={file.is_directory ? "folder" : visual.icon} />;
};

export default FileIcon;
