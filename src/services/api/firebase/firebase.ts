import { getApp } from "@react-native-firebase/app"
import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

export type User = FirebaseAuthTypes.User

// Configuration for Google Sign-In
const GOOGLE_SIGNIN_CONFIG = {
  webClientId: "382400761834-8avomnpek5ra184es31brqfs0emqsofu.apps.googleusercontent.com", // Get from Firebase Console
  offlineAccess: true,
  scopes: ["profile", "email"],
}

interface AuthError {
  code: string
  message: string
}

interface ErrorMessages {
  [key: string]: string
}

const NATIVE_FIREBASE_APP = getApp()
const NATIVE_FIREBASE_AUTH = getAuth(NATIVE_FIREBASE_APP)

class AuthService {
  private currentUser: User | null
  private readonly unsubscribe: (() => void) | null

  constructor() {
    // Initialize Google Sign-In
    this.configureGoogleSignIn()

    // Current user state
    this.currentUser = null

    // Set up auth state listener
    this.unsubscribe = onAuthStateChanged(NATIVE_FIREBASE_AUTH, (user) => {
      this.currentUser = user
    })
  }

  // Configure Google Sign-In
  configureGoogleSignIn() {
    GoogleSignin.configure(GOOGLE_SIGNIN_CONFIG)
  }

  // Anonymous Sign-In
  async signInAnonymously(): Promise<{
    success: boolean
    user?: User
    error?: AuthError
  }> {
    try {
      const userCredential = await signInAnonymously(NATIVE_FIREBASE_AUTH)
      return {
        success: true,
        user: userCredential.user,
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      }
    }
  }

  // Email Sign-In (Login or Sign-up)
  async signInWithEmail({
    email,
    password,
    isSignUp = false,
  }: {
    email: string
    password: string
    isSignUp?: boolean
  }): Promise<{ success: boolean; user?: User; error?: AuthError }> {
    try {
      let userCredential
      if (isSignUp) {
        // Create new user with email and password
        userCredential = await createUserWithEmailAndPassword(NATIVE_FIREBASE_AUTH, email, password)
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(NATIVE_FIREBASE_AUTH, email, password)
      }
      return {
        success: true,
        user: userCredential.user,
      }
    } catch (error) {
      console.error("Email Sign-In error:", error)
      return {
        success: false,
        error: this.handleAuthError(error),
      }
    }
  }

  // Google Sign-In
  async signInWithGoogle(): Promise<{
    success: boolean
    user?: User
    error?: AuthError
  }> {
    try {
      // Get Google ID token
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const { data, type } = await GoogleSignin.signIn()

      if (type !== "success") {
        console.warn("Google Sign-In was not successful:", type)
        return {
          success: false,
          error: { code: "user_cancelled", message: "User cancelled the sign-in process" },
        }
      }

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(data?.idToken)

      // Sign in with Firebase
      const userCredential = await NATIVE_FIREBASE_AUTH.signInWithCredential(googleCredential)

      return {
        success: true,
        user: userCredential.user,
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      }
    }
  }

  // Sign Out
  async signOut(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      // Sign out from Google if signed in
      if (this.currentUser) {
        await GoogleSignin.signOut()
      }

      // Sign out from Firebase
      await signOut(NATIVE_FIREBASE_AUTH)

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      }
    }
  }

  // Get Current User
  getCurrentUser() {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser
  }

  // Check if user is anonymous
  isAnonymous() {
    return this.currentUser?.isAnonymous || false
  }

  // Get user ID token
  async getIdToken() {
    try {
      if (this.currentUser) {
        const token = await this.currentUser.getIdToken()
        return {
          success: true,
          token,
        }
      }
      return {
        success: false,
        error: "No user signed in",
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      }
    }
  }

  // Error handling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleAuthError(error: any): AuthError {
    console.error("auth Error:", error)
    const errorMessages: ErrorMessages = {
      "auth/email-already-in-use": "Email already in use",
      "auth/invalid-credential": "Invalid credentials",
      "auth/operation-not-allowed": "Operation not allowed",
      "auth/weak-password": "Password is too weak",
      "auth/user-not-found": "User not found",
      "auth/wrong-password": "Incorrect password",
      "auth/too-many-requests": "Too many attempts, try again later",
      "auth/invalid-email": "Invalid email format",
      "auth/user-disabled": "User account is disabled",
    }

    return {
      code: error.code,
      message: errorMessages[error.code] || error.message || "An error occurred",
    }
  }

  // Cleanup
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

export const authService = new AuthService()
