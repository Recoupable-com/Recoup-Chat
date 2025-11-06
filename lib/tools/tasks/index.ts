import createTaskTool from "./createTask";
import getTasksTool from "./getTasks";
import updateTaskTool from "./updateTask";
import deleteTaskTool from "./deleteTask";

const tasksTools = {
  create_task: createTaskTool,
  get_tasks: getTasksTool,
  update_task: updateTaskTool,
  delete_task: deleteTaskTool,
};

export default tasksTools;
