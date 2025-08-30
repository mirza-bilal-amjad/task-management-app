import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { SplashScreen, Stack } from "expo-router"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { observer } from "mobx-react-lite"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

import { initI18n } from "@/i18n"
import { useInitialRootStore } from "@/models"
import { ThemeProvider } from "@/theme/context"
import { customFontsToLoad } from "@/theme/typography"
import { loadDateFnsLocale } from "@/utils/formatDate"

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary"

export default observer(function Root() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  const {
    rehydrated,
    rootStore: { authStore },
  } = useInitialRootStore()

  const isLoggedIn = Platform.OS === "web" || !!authStore?.authToken

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized && rehydrated

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name={"(login)"} />
                <Stack.Screen name={"signup"} />
              </Stack.Protected>
              <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name={"(tabs)"} />
              </Stack.Protected>
            </Stack>
          </KeyboardProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
})

interface UnstableSettings {
  initialRouteName: string
  onUnhandledError: (error: unknown) => void
}

export const unstable_settings: UnstableSettings = {
  // This is used to enable the new Expo Router v2 features.
  // See https://expo.github.io/router/docs/v2/unstable-settings
  initialRouteName: "(tabs)",
  onUnhandledError: (error: unknown) => {
    console.error("Unhandled error in Expo Router:", error)
  },
}
