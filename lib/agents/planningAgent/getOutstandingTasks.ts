import type { Plan } from "./addTasksToPlan";

export function getOutstandingTasks(plan: Plan): Plan {
  return plan.filter((t) => !t.completed);
}
