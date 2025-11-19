export interface PlanTask {
  id: string;
  task: string;
  completed: boolean;
}

export type Plan = PlanTask[];

export function addTasksToPlan(tasks: string[], plan: Plan): void {
  tasks.forEach((task) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    plan.push({ id, task, completed: false });
  });
}
