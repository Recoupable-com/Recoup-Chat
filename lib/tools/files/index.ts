import listFiles from "./listFiles";
import readFile from "./readFile";
import writeFile from "./writeFile";
import updateFile from "./updateFile";

const filesTools = {
  read_file: readFile,
  list_files: listFiles,
  write_file: writeFile,
  update_file: updateFile,
};

export default filesTools;