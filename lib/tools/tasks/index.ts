import createTasksTool from "./createTasks";
import getTasksTool from "./getTasks";
import updateTaskTool from "./updateTask";
import deleteTaskTool from "./deleteTask";

const tasksTools = {
  create_tasks: createTasksTool,
  get_tasks: getTasksTool,
  update_task: updateTaskTool,
  delete_tasks: deleteTaskTool,
};

export default tasksTools;

