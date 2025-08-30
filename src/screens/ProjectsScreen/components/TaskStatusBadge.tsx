import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"
import { TaskStatusType, getBadgeStyleConfig } from "@/utils/taskUtils"

interface TaskStatusBadgeProps {
  title: string
  count: number
  type: TaskStatusType
}

export const TaskStatusBadge: FC<TaskStatusBadgeProps> = ({ title, count, type }) => {
  const { themed, theme: { colors } } = useAppTheme()

  return (
    <View style={themed([$taskBadge, getBadgeStyleConfig(type, colors)])}>
      <Text text={title} size="xs" weight="medium" />
      <View style={themed($taskBadgeCount)}>
        <Text text={count.toString()} size="xs" weight="bold" />
      </View>
    </View>
  )
}

// Styles
const $taskBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.lg,
  borderWidth: 1,
})

const $taskBadgeCount: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  paddingHorizontal: spacing.xs,
  paddingVertical: 2,
  borderRadius: spacing.sm,
  minWidth: 24,
  alignItems: "center",
})