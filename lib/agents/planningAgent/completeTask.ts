import type { Plan } from "./addTasksToPlan";

export function completeTask(id: string, plan: Plan): void {
  const task = plan.find((t) => t.id === id);
  if (task) {
    task.completed = true;
  }
}
