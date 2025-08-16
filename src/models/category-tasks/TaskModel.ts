import { format, isBefore, add } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { Attachment, AttachmentModel } from "./AttachmentModel"
import { PeopleModel } from "./PeopleModel"
import { SubTask, SubTaskModel, SubTaskSnapshot } from "./SubTaskModel"

// Status enumeration for task
export const TaskStatusEnum = types.enumeration(["to-do", "in-progress", "completed"])

// Type for the task status, which is an instance of the TaskStatusEnum
export type TaskStatusType = Instance<typeof TaskStatusEnum>

// Task model definition
export const TaskModel = types
  .model("Task", {
    id: types.identifier,
    categoryId: types.string, // Reference to the category this task belongs to
    title: types.string,
    description: types.optional(types.string, ""),
    assignedPeople: types.array(PeopleModel),
    dueDate: types.Date,
    dueTime: types.string,
    estimatedTime: types.number,
    progress: types.number, // 0-100
    attachments: types.array(AttachmentModel),
    subtasks: types.array(SubTaskModel),
  })
  .actions((self) => ({
    updateProgress() {
      if (self.subtasks.length) {
        const completed = self.subtasks.filter((s) => s.completed).length
        self.progress = Math.round((completed / self.subtasks.length) * 100)
      }
    },
  }))

  .actions((self) => ({
    update(data: TaskSnapshot) {
      Object.assign(self, data)
      self.updateProgress()
    },
    addSubtask(subtask: SubTaskSnapshot) {
      self.subtasks.push(subtask)
      self.updateProgress()
    },
    toggleSubtask(subtaskId: SubTask["id"]) {
      const subtask = self.subtasks.find((s) => s.id === subtaskId)
      if (subtask) {
        subtask.completed = !subtask.completed
        self.updateProgress()
      }
    },
    addAttachment(attachment: Attachment) {
      self.attachments.push(attachment)
    },
  }))
  .views((self) => ({
    get isDueSoon() {
      const dueDateTime = new Date(`${format(self.dueDate, "yyyy-MM-dd")}T${self.dueTime}`)
      const now = new Date()
      return isBefore(dueDateTime, add(now, { hours: 24 })) && dueDateTime > now
    },
    get isOverdue() {
      const dueDateTime = new Date(`${format(self.dueDate, "yyyy-MM-dd")}T${self.dueTime}`)
      return isBefore(dueDateTime, new Date())
    },
  }))
/**
 * The Task instance.
 */
export interface Task extends Instance<typeof TaskModel> {}
/**
 * The data of a Task.
 */
export interface TaskSnapshot extends SnapshotOut<typeof TaskModel> {}
