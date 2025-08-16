import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthService } from "@/services/api/firebase"
import { type User } from "@/services/api/firebase/firebase"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    user: types.maybeNull(types.frozen<User>()),
    authToken: types.maybe(types.string),
    authImage: types.maybe(types.string),
    authName: "",
    authEmail: "",
    authPassword: "",
    confirmAuthPassword: "",
  })
  .volatile(() => ({
    loadingWithGoogle: false,
    loadingWithEmail: false,
  }))
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
    setUser(value: any) {
      store.user = value
    },
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
      await AuthService.signOut()
    },
    setLoadingWithGoogle(value: boolean) {
      store.loadingWithGoogle = value
    },
    setLoadingWithEmail(value: boolean) {
      store.loadingWithEmail = value
    },
  }))
  .actions((store) => ({
    loginWithEmail: async (needToSignUp: boolean) => {
      store.setLoadingWithEmail(true)
      await AuthService.signInWithEmail({
        email: store.authEmail,
        password: store.authPassword,
        isSignUp: needToSignUp,
      })
        .then(({ user, success }) => {
          if (success) {
            store.setUser(user)
            store.setLoadingWithEmail(false)
            store.setAuthToken(user?.uid)
            store.setAuthPassword("")
          } else {
            throw new Error("Login failed")
          }
        })
        .catch((error) => {
          store.setLoadingWithEmail(false)
          console.error("Login failed:", error)
          throw new Error(error.message || "Login failed")
        })
    },
    loginWithGoogle: async () => {
      store.setLoadingWithGoogle(true)
      await AuthService.signInWithGoogle()
        .then(({ user, success }) => {
          if (user && success) {
            store.setLoadingWithGoogle(false)
            store.setUser(user)
            store.setAuthToken(user.uid)
            store.setAuthImage(user.photoURL ?? "")
          } else {
            throw new Error("Google Sign-In failed")
          }
        })
        .catch((error) => {
          store.setLoadingWithGoogle(false)
          console.error("Google Sign-In failed:", error)
          throw new Error(error.message || "Google Sign-In failed")
        })
    },
    loginAnonymously: async () => {
      AuthService.signInAnonymously()
        .then(({ user, success }) => {
          if (success) {
            store.setAuthToken(user?.uid)
          } else {
            throw new Error("Anonymous Sign-In failed")
          }
        })
        .catch((error) => {
          console.error("Anonymous Sign-In failed:", error)
          throw new Error(error.message || "Anonymous Sign-In failed")
        })
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}

export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
