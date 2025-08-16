const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  loginScreen: {
    logIn: "Log In",
    letsJumpIn: "Let's jump in!",
    orLoginWith: "Or login with",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToLogIn: "Tap to log in!",
    hint: "Hint: you can use any email address and your favorite password :)",
    loginWithGoogle: "Login with Google",
    dontHaveAccount: "Don't have an account?",
    registerNow: "Register now",
  },
  signUpScreen: {
    signup: "Sign Up",
    enterDetails: "Provide your details below to create an account.",
    nameFieldLabel: "Name",
    nameFieldPlaceholder: "Enter your name",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    confirmPasswordFieldLabel: "Confirm Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Enter password here",
    confirmPasswordFieldPlaceholder: "Enter confirm password here",
    tapToSignUp: "Tap to sign up!",
    orSignupWith: "Or sign up with",
    hint: "Hint: you can use any email address and your favorite password :)",
    signUpWithGoogle: "Sign up with Google",
    haveAccount: "Already have an account?",
    loginNow: "Login now",
  },
}

export default en
export type Translations = typeof en
