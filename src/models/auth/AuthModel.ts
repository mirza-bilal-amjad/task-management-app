import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthService } from "@/services/api/firebase"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    user: types.maybeNull(types.frozen()), // User object can be null or an object
    authToken: types.maybe(types.string),
    authImage: types.maybe(types.string),
    authName: "",
    authEmail: "",
    authPassword: "",
    confirmAuthPassword: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get emailValidationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
    get passwordValidationError() {
      if (store.authPassword.length === 0) return "can't be blank"
      return ""
    },
    get confirmPasswordValidationError() {
      if (store.confirmAuthPassword.length === 0) return "can't be blank"
      if (store.confirmAuthPassword !== store.authPassword) return "passwords must match"
      return ""
    },
    get authNameValidationError() {
      if (store.authName.length === 0) return "can't be blank"
      if (store.authName.length <= 2) return "name can't be of two letters"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthImage(value: string) {
      store.authImage = value
    },
    setAuthName(value: string) {
      store.authName = value
    },
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthPassword(value: string) {
      store.authPassword = value
    },
    setAuthConfirmPassword(value: string) {
      store.confirmAuthPassword = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    async logout() {
      store.authToken = undefined
      store.authPassword = ""
      store.user = null
      await AuthService.signOut()
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}

export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
