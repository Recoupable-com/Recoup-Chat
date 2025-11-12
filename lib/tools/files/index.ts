import listFiles from "./listFiles";
import readFile from "./readFile";
import writeFile from "./writeFile";
import updateFile from "./updateFile";
import deleteFile from "./deleteFile";
import renameFile from "./renameFile";
import moveFile from "./moveFile";

const filesTools = {
  read_file: readFile,
  list_files: listFiles,
  write_file: writeFile,
  update_file: updateFile,
  delete_file: deleteFile,
  rename_file: renameFile,
  move_file: moveFile,
};

export default filesTools;