import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { PeopleModel } from "./PeopleModel"

export const SubTaskModel = types
  .model("SubTask", {
    id: types.identifier,
    title: types.string,
    assignedPerson: types.maybeNull(PeopleModel),
    completed: types.boolean,
  })
  .actions((self) => ({
    update(data: Partial<SubTask>) {
      Object.assign(self, data)
    },
  }))
export interface SubTask extends Instance<typeof SubTaskModel> {}
export interface SubTaskSnapshot extends SnapshotOut<typeof SubTaskModel> {}
