import { ComponentType, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { observer } from "mobx-react-lite"

import {
  Button,
  PressableIcon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "@/components"
import { useStores } from "@/models"
import { colors, spacing } from "@/theme"
import { useAppTheme } from "@/theme/context"

export default observer(function Login(_props) {
  const authPasswordInput = useRef<any>(null)
  const {
    theme: { colors },
  } = useAppTheme()

  const Router = useRouter()

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const {
    authStore: {
      authEmail,
      authPassword,
      setAuthPassword,
      setAuthEmail,
      emailValidationError,
      passwordValidationError,
      loginWithEmail,
      loginWithGoogle,
      loadingWithEmail,
      loadingWithGoogle,
    },
  } = useStores()

  useEffect(() => {
    return () => {
      setAuthPassword("")
    }
  }, [setAuthPassword])

  const emailError = isSubmitted ? emailValidationError : ""
  const passwordError = isSubmitted ? passwordValidationError : ""

  // @ts-ignore
  const PasswordRightAccessory: React.ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            size={20}
            activeOpacity={1}
            color={colors.palette.neutral100}
            containerStyle={props.style as ViewStyle}
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [colors.palette.neutral100, isAuthPasswordHidden],
  )

  const GoogleButtonAccessory: ComponentType = useMemo(
    () =>
      function GoogleButtonAccessory() {
        if (loadingWithGoogle) return <ActivityIndicator size={"small"} color={colors.tint} />
        return <Ionicons name={"logo-google"} size={spacing.md} color={colors.tint} />
      },
    [colors.tint, loadingWithGoogle],
  )

  const LeftLoadingAccessory: ComponentType = useMemo(
    () =>
      function LeftLoadingAccessory() {
        if (!loadingWithEmail) return
        return <ActivityIndicator size={"small"} color={colors.tint} />
      },
    [colors.tint, loadingWithEmail],
  )

  function navigateToSignUpScreen() {
    Router.push("/signup")
  }

  async function login() {
    if (loadingWithEmail) return
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (emailValidationError || passwordValidationError) return
    await loginWithEmail(false)
  }

  async function onPressGoogleSignIn() {
    if (loadingWithGoogle || loadingWithEmail) return
    await loginWithGoogle()
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={$logIn} />
      <Text tx={"loginScreen:enterDetails"} preset="subheading" style={$enterDetails} />
      <Text tx={"loginScreen:letsJumpIn"} preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen:hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen:emailFieldLabel"
        placeholderTx="loginScreen:emailFieldPlaceholder"
        helper={emailError}
        status={emailError ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        helper={passwordError}
        status={passwordError ? "error" : undefined}
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen:passwordFieldLabel"
        placeholderTx="loginScreen:passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen:tapToLogIn"
        style={$tapButton}
        LeftAccessory={LeftLoadingAccessory}
        preset={"reversed"}
        onPress={login}
      />
      <Text tx={"loginScreen:orLoginWith"} size={"xs"} weight={"light"} style={$loginWith} />

      <Button
        testID={"google-signup-button"}
        LeftAccessory={GoogleButtonAccessory}
        tx={"loginScreen:loginWithGoogle"}
        onPress={onPressGoogleSignIn}
        style={$tapButton}
      />

      <View style={$haveAccount}>
        <Text size={"xs"} tx={"loginScreen:dontHaveAccount"} />
        <Text
          size={"xs"}
          tx={"loginScreen:registerNow"}
          weight={"bold"}
          style={$registerNow}
          onPress={navigateToSignUpScreen}
        />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $logIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.md,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.md,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
  gap: spacing.sm,
}

const $haveAccount: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.md,
  gap: spacing.xxs,
}

const $loginWith: TextStyle = {
  marginVertical: spacing.sm,
  textAlign: "center",
  marginHorizontal: spacing.lg,
}

const $registerNow: TextStyle = { textDecorationLine: "underline" }
