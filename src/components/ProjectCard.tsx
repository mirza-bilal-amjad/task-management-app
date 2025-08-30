import React, { FC, useEffect } from "react"
import { ImageURISource, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { observer } from "mobx-react-lite"
import { Text } from "@/components"
import { CategoryStoreSnapshot } from "@/models/category-tasks/CategoryModel"
import { $styles, ThemedStyle, useAppTheme } from "@/theme"
import { StackedImages } from "./StackedImages"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated"

type ProjectCardProps = CategoryStoreSnapshot & {}

// Moved all inline styles to the top
const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary200,
  borderRadius: spacing.lg,
  padding: spacing.md,
  minHeight: 200,
  justifyContent: "space-between",
})

const $imageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  marginBottom: spacing.xs,
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginVertical: spacing.xs,
  textAlignVertical: "top",
  lineHeight: 25,
})

const $categoryContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 15,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
  alignSelf: "flex-end",
  marginBottom: spacing.sm,
})

const $category: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.text,
})

const $dueDate: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
})

const $progressContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

const $progressText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  color: colors.text,
  textAlign: "right",
  textAlignVertical: "bottom",
  lineHeight: 15,
})

const $progressBar: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm - 2,
  backgroundColor: "#E0E0E0",
  borderRadius: spacing.sm,
  overflow: "hidden",
})

const $progressFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.tint,
  borderRadius: 5,
})

const $rowSpaceBetween: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
})

const $flex1: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $progressRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 50,
})

export const ProjectCard: FC<ProjectCardProps> = observer(({ id, name, description }) => {
  const Router = useRouter()
  const { themed } = useAppTheme()
  const sharedProgress = useSharedValue(0)

  const images: ImageURISource[] = [
    { uri: "https://dummyjson.com/icon/emilys/128" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
    { uri: "https://dummyjson.com/icon/emilys/120" },
  ]

  const category: string = "Freelance"
  const dueDate: string = "20 Oct"

  // Animated style for progress bar
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${sharedProgress.value}%`,
  }))

  // Derived value for progress text to ensure smooth updates
  const progressText = useDerivedValue(() => {
    return `${Math.round(interpolate(sharedProgress.value, [0, 100], [0, 100]))}%`
  })

  const handleOnPressProjectItem = () => {
    Router.push(`/categories/[${id}]`)
  }

  useEffect(() => {
    // Animate progress from 0 to 100 over 2 seconds
    sharedProgress.value = withTiming(100, { duration: 1000 })

    return () => {
      // Reset animation on unmount
      sharedProgress.value = 0
    }
  }, [sharedProgress])

  return (
    <TouchableOpacity activeOpacity={1} style={themed($card)} onPress={handleOnPressProjectItem}>
      <View style={themed($rowSpaceBetween)}>
        <View style={themed($imageContainer)}>
          <StackedImages images={images} size={30} />
        </View>
        <View style={themed($categoryContainer)}>
          <Text style={themed($category)} text={category} />
        </View>
      </View>

      <View style={themed($flex1)}>
        <Text size="xl" weight="bold" style={themed($title)} numberOfLines={4} text={name} />
      </View>
      <View>
        <View>
          <Animated.Text style={themed($progressText)}>{progressText.value}</Animated.Text>
        </View>
        <View style={themed($progressRow)}>
          <View>
            <Text size="xxs" style={themed($dueDate)}>
              Due: {dueDate}
            </Text>
          </View>
          <View style={themed($progressContainer)}>
            <View style={themed($progressBar)}>
              <Animated.View key={"progress-fill"} style={[themed($progressFill), animatedStyle]} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})
