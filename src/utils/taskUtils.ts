/**
 * Task and project utility functions
 */

/**
 * Task status types
 */
export type TaskStatusType = "todo" | "progress" | "review"

/**
 * Get task statistics for different statuses
 * @param tasks - Array of tasks
 * @param getTodoTasks - Function to get todo tasks
 * @param getDueTasks - Function to get due tasks
 * @returns Task counts by status
 */
export function getTaskStatistics(
  tasks: any[],
  getTodoTasks: () => any[],
  getDueTasks: () => any[],
) {
  const todoCount = getTodoTasks().length
  const inProgressCount = getDueTasks().length
  // For now, we'll use a simple filter for review tasks
  // You can modify this logic based on your actual task model
  const underReviewCount = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes("review") ||
      task.description?.toLowerCase().includes("review"),
  ).length || 1

  return {
    todoCount,
    inProgressCount,
    underReviewCount,
  }
}

/**
 * Get badge style configuration based on task type
 * @param type - The task status type
 * @param colors - Theme colors object
 * @returns Style configuration for the badge
 */
export function getBadgeStyleConfig(type: TaskStatusType, colors: any) {
  switch (type) {
    case "todo":
      return {
        backgroundColor: colors.palette.primary200,
        borderColor: colors.palette.primary300,
      }
    case "progress":
      return {
        backgroundColor: colors.palette.secondary200,
        borderColor: colors.palette.secondary300,
      }
    case "review":
      return {
        backgroundColor: colors.palette.accent200,
        borderColor: colors.palette.accent300,
      }
    default:
      return {
        backgroundColor: colors.palette.neutral200,
        borderColor: colors.palette.neutral300,
      }
  }
}