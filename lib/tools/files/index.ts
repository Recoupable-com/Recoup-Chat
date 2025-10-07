import listFiles from "./listFiles";
import readFile from "./readFile";
import writeFile from "./writeFile";

const filesTools = {
  read_file: readFile,
  list_files: listFiles,
  write_file: writeFile,
};

export default filesTools;