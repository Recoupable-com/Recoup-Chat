import type { Plan } from "./addTasksToPlan";

export function renderPlan(plan: Plan): string {
  if (plan.length === 0) {
    return "No tasks in plan.";
  }

  const outstanding = plan.filter((t) => !t.completed);
  const completed = plan.filter((t) => t.completed);

  let output = "";

  if (outstanding.length > 0) {
    output += "Outstanding tasks:\n";
    outstanding.forEach((task, index) => {
      output += `${index + 1}. ${task.task}\n`;
    });
  }

  if (completed.length > 0) {
    output += "\nCompleted tasks:\n";
    completed.forEach((task, index) => {
      output += `${index + 1}. ${task.task} ✓\n`;
    });
  }

  return output;
}
