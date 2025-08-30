import React, { ComponentType, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { ActivityIndicator, TextInput, TextStyle, View, ViewStyle } from "react-native"
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
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"

export const Signup = observer(function Signup() {
  const authEmailInput = useRef<TextInput>(null)
  const authPasswordInput = useRef<TextInput>(null)
  const authConformPasswordInput = useRef<TextInput>(null)
  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()

  const Router = useRouter()

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const {
    authStore: {
      authName,
      setAuthName,
      authNameValidationError,
      authEmail,
      setAuthEmail,
      authPassword,
      setAuthPassword,
      confirmAuthPassword,
      setAuthConfirmPassword,
      emailValidationError,
      passwordValidationError,
      confirmPasswordValidationError,
      loginWithEmail,
      loginWithGoogle,
      loadingWithGoogle,
      loadingWithEmail,
    },
  } = useStores()

  useEffect(() => {
    return () => {
      setAuthPassword("")
      setAuthConfirmPassword("")
    }
  }, [setAuthConfirmPassword, setAuthPassword])
  const authNameError = isSubmitted ? authNameValidationError : ""
  const emailError = isSubmitted ? emailValidationError : ""
  const passwordError = isSubmitted ? passwordValidationError : ""
  const confirmPasswordError = isSubmitted ? confirmPasswordValidationError : ""

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style as ViewStyle}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [colors.palette.neutral800, isAuthPasswordHidden],
  )
  const GoogleButtonAccessory: ComponentType = useMemo(
    () =>
      function GoogleButtonAccessory() {
        if (loadingWithGoogle) return <ActivityIndicator size={"small"} color={colors.tint} />
        return <Ionicons name={"logo-google"} size={spacing.md} color={colors.tint} />
      },
    [colors.tint, loadingWithGoogle, spacing.md],
  )
  const LoadingAccessory: ComponentType = useMemo(
    () =>
      function LoadingAccessory() {
        if (!loadingWithEmail) return <></>
        return <ActivityIndicator size={"small"} color={colors.tint} />
      },
    [colors.tint, loadingWithEmail],
  )

  function navigateToLoginScreen() {
    if (Router.canGoBack()) {
      Router.back()
    }
  }

  async function signUp() {
    if (loadingWithEmail) return
    setAttemptsCount(attemptsCount + 1)
    setIsSubmitted(true)

    if (
      authNameError ||
      emailValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return
    }
    await loginWithEmail(true)
  }

  async function onPressGoogleSignIn() {
    if (loadingWithGoogle || loadingWithEmail) return
    await loginWithGoogle()
    Router.dismissTo("/(tabs)/home")
  }

  return (
    <Screen
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
      preset="auto"
    >
      <Text
        testID={"signup-heading"}
        tx={"signUpScreen:signup"}
        preset={"heading"}
        style={themed($logIn)}
      />
      <Text tx={"signUpScreen:enterDetails"} preset={"subheading"} style={themed($enterDetails)} />
      {attemptsCount > 2 && (
        <Text tx={"loginScreen:hint"} size={"sm"} weight={"light"} style={themed($hint)} />
      )}

      <TextField
        value={authName}
        onChangeText={setAuthName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="default"
        labelTx={"signUpScreen:nameFieldLabel"}
        placeholderTx={"signUpScreen:nameFieldPlaceholder"}
        helper={authNameError} //
        status={authNameError ? "error" : undefined}
        returnKeyType={"next"}
        onSubmitEditing={() => authEmailInput.current?.focus()}
      />
      <TextField
        ref={authEmailInput}
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx={"signUpScreen:emailFieldLabel"}
        placeholderTx={"signUpScreen:emailFieldPlaceholder"}
        helper={emailError} //
        status={emailError ? "error" : undefined}
        returnKeyType={"next"}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        helper={passwordError}
        status={passwordError ? "error" : undefined}
        autoCorrect={false}
        returnKeyType={"next"}
        secureTextEntry={isAuthPasswordHidden}
        labelTx={"signUpScreen:passwordFieldLabel"}
        placeholderTx={"signUpScreen:passwordFieldPlaceholder"}
        onSubmitEditing={() => authConformPasswordInput.current?.focus()}
        RightAccessory={PasswordRightAccessory}
      />

      <TextField
        ref={authConformPasswordInput}
        value={confirmAuthPassword}
        onChangeText={setAuthConfirmPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        helper={confirmPasswordError}
        status={confirmPasswordError ? "error" : undefined}
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        returnKeyType={"default"}
        labelTx={"signUpScreen:confirmPasswordFieldLabel"}
        placeholderTx={"signUpScreen:confirmPasswordFieldPlaceholder"}
        onSubmitEditing={signUp}
      />

      <Button
        testID={"signup-button"}
        LeftAccessory={LoadingAccessory}
        tx={"signUpScreen:tapToSignUp"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={signUp}
      />

      <Text
        tx={"signUpScreen:orSignupWith"}
        size={"xs"}
        weight={"light"}
        style={themed($signUpWith)}
      />

      <Button
        testID={"google-signup-button"}
        onPress={onPressGoogleSignIn}
        LeftAccessory={GoogleButtonAccessory}
        tx={"signUpScreen:signUpWithGoogle"}
        style={themed($tapButton)}
      />

      <View style={themed($haveAccount)}>
        <Text size={"xs"} tx={"signUpScreen:haveAccount"} />
        <Text
          size={"xs"}
          tx={"signUpScreen:loginNow"}
          weight={"bold"}
          style={$loginNow}
          onPress={navigateToLoginScreen}
        />
      </View>
    </Screen>
  )
})

export default Signup
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $haveAccount: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.md,
  gap: spacing.xxs,
})

const $hint: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs / 2,
  gap: spacing.sm,
})

const $signUpWith: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginVertical: spacing.sm,
  textAlign: "center",
  marginHorizontal: spacing.lg,
})
const $loginNow: TextStyle = { textDecorationLine: "underline" }
