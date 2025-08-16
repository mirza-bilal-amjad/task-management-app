import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { withSetPropAction } from "@/models/helpers/withSetPropAction"

import { Task, TaskModel, TaskSnapshot } from "./TaskModel"

export const CategoryModel = types
  .model("Category", {
    id: types.identifier,
    name: types.string,
    description: types.string,
    tasks: types.array(TaskModel),
    createdAt: types.Date,
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addTask(task: TaskSnapshot) {
      self.tasks.push(task)
    },
    update({ name, description }: { name?: string; description?: string }) {
      self.name = name || self.name
      self.description = description || self.description
    },
    deleteTask(taskId: Task["id"]) {
      const index = self.tasks.findIndex((task) => task.id === taskId)
      if (index > -1) {
        self.tasks.splice(index, 1)
      }
    },
  }))
  .views((self) => ({
    get totalTasks() {
      return self.tasks.length
    },
    get progress() {
      if (!self.tasks.length) return 0
      const totalProgress = self.tasks.reduce((sum, task) => sum + task.progress, 0)
      return Math.round(totalProgress / self.tasks.length)
    },
    get dueTasks() {
      return self.tasks.filter((task) => {
        const dueDate = new Date(task.dueDate)
        const now = new Date()
        return dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)
      })
    },
  }))

export interface CategoryStore extends Instance<typeof CategoryModel> {}
export interface CategoryStoreSnapshot extends SnapshotOut<typeof CategoryModel> {}
