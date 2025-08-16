import { Instance, SnapshotOut, types } from "mobx-state-tree"

const AttachmentTypeEnum = types.enumeration(["link", "image", "document"])

// Attachment model definition
export const AttachmentModel = types.model("Attachment", {
  type: AttachmentTypeEnum,
  url: types.string,
})

export interface Attachment extends Instance<typeof AttachmentModel> {}
export interface AttachmentSnapshot extends SnapshotOut<typeof AttachmentModel> {}
