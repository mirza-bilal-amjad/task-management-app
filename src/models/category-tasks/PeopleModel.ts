import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const PeopleModel = types
  .model("People", {
    id: types.identifier,
    name: types.string,
    email: types.string,
    imageUrl: types.optional(types.string, ""),
    // Add more fields as needed
  })
  .actions((self) => ({
    updateName(newName: string) {
      self.name = newName
    },
    updateEmail(newEmail: string) {
      self.email = newEmail
    },
    updateImageUrl(newImageUrl: string) {
      self.imageUrl = newImageUrl
    },
  }))

export interface People extends Instance<typeof PeopleModel> {}
export interface PeopleSnapshot extends SnapshotOut<typeof PeopleModel> {}
