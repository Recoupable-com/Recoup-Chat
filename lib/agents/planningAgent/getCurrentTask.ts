import type { Plan, PlanTask } from "./addTasksToPlan";

export function getCurrentTask(plan: Plan): PlanTask | null {
  const outstanding = plan.filter((t) => !t.completed);
  return outstanding.length > 0 ? outstanding[0] : null;
}
