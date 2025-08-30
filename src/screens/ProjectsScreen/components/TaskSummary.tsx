import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Icon, Text } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"

interface TaskSummaryProps {
  taskCount: number
  colors: any
}

export const TaskSummary: FC<TaskSummaryProps> = ({ taskCount, colors }) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($taskSummaryContainer)}>
      <Text
        text={`You have ${taskCount} tasks`}
        size="xl"
        weight="bold"
        style={themed($taskSummaryTitle)}
      />
      <View style={themed($taskSummaryRow)}>
        <Text text="Medium priority" size="sm" style={themed($taskSummarySubtitle)} />
        <Icon icon="caretRight" size={16} color={colors.tint} />
      </View>
    </View>
  )
}

// Styles
const $taskSummaryContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $taskSummaryTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xs,
})

const $taskSummaryRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $taskSummarySubtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})