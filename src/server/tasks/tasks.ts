// Backend functions for fetching, posting, etc.
"use server";

import type { TaskCreateInput } from "@/types/task";
import { EPriority, ETaskStatus } from "@/config/enums";

/**
 * Server Action: create a new task.
 * Replace the body with a real database call.
 */
export async function createTask(input: TaskCreateInput) {
  // TODO: replace with real DB insert
  console.log("Creating task:", input);

  return {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description ?? "",
    priority: input.priority ?? EPriority.medium,
    status: ETaskStatus.todo,
    assigneeId: input.assigneeId ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
