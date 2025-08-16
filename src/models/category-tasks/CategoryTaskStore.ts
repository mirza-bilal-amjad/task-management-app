import { isSameDay, startOfDay } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { CategoryModel } from "./CategoryModel"
import { PeopleSnapshot } from "./PeopleModel"
import { SubTaskSnapshot } from "./SubTaskModel"
import { TaskModel, TaskSnapshot } from "./TaskModel"

export const FilterEnum = types.enumeration(["to-do", "in-progress", "completed", "all"])
// Type for the filter, which is an instance of the FilterEnum
export type FilterEnumType = Instance<typeof FilterEnum>

export const CategoryTaskStoreModel = types
  .model("CategoryTaskStore", {
    categories: types.array(CategoryModel),
    tasks: types.array(TaskModel),
  })

  .actions((self) => ({
    addProject({ name, description }: { name: string; description: string }) {
      const id = Math.random().toString(36).substring(2, 15) // Generate a random ID
      self.categories.push({ id, name, description, createdAt: new Date(), tasks: [] })
    },
    addTask({
      categoryId,
      title,
      description,
      assignedPeople,
      dueDate,
      dueTime,
      estimatedTime,
    }: {
      categoryId: string
      title: string
      description: string
      assignedPeople: PeopleSnapshot[]
      dueDate: number
      dueTime: string
      estimatedTime: number
    }) {
      const id = Math.random().toString(36).substring(2, 15) // Generate a random ID
      const task = {
        id,
        categoryId,
        title,
        description,
        assignedPeople,
        dueDate,
        dueTime,
        estimatedTime,
        progress: 0,
        attachments: [],
        subtasks: [],
      }
      self.tasks.push(task)
      const category = self.categories.find((c) => c.id === categoryId)
      if (category) category.addTask(task)
    },

    addSubtask({
      taskId,
      title,
      assignedPerson,
    }: {
      taskId: TaskSnapshot["id"]
      title: TaskSnapshot["title"]
      assignedPerson: PeopleSnapshot
    }) {
      const subtask: SubTaskSnapshot = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        title,
        assignedPerson,
        completed: false,
      }
      const task = self.tasks.find((t) => t.id === taskId)
      if (task) task.addSubtask(subtask)
    },
  }))
  .views((self) => ({
    getTodayTasks() {
      const today = startOfDay(new Date())
      return self.tasks.filter((task) => isSameDay(task.dueDate, today))
    },
    getTodoTasks() {
      return self.tasks
        .filter((task) => task.progress < 100)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    },
    getDueTasks() {
      return self.tasks.filter((task) => task.isDueSoon || task.isOverdue)
    },
    getTodaysRecentTasks() {
      const today = startOfDay(new Date())
      return self.tasks.filter((task) => isSameDay(task.dueDate, today))?.slice(0, 3)
    },
    getRecentProjects() {
      return self.categories
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    },
  }))

export interface CategoryTaskStore extends Instance<typeof CategoryTaskStoreModel> {}

export interface CategoryTaskStoreSnapshot extends SnapshotOut<typeof CategoryTaskStoreModel> {}
