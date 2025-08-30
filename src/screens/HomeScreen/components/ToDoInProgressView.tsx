import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import { Icon, Text } from "@/components"
import { useStores } from "@/models"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"

interface ToDoInProgressViewProps {
  type?: "todo" | "in-progress"
}

export const ToDoInProgressView: FC<ToDoInProgressViewProps> = observer(({ type }) => {
  const {
    themed,
    theme: { colors, spacing },
  } = useAppTheme()
  const {
    categoriesStore: { getDueTasks, getTodoTasks },
  } = useStores()

  const backgroundColor = type === "todo" ? colors.palette.primary200 : colors.palette.secondary200
  const numberOfTasks = type === "todo" ? getTodoTasks().length : getDueTasks().length
  const cardTitle = type === "in-progress" ? "In progress" : "To do list"

  return (
    <View style={themed([$toDoInProgressCard, { backgroundColor }])}>
      <View>
        <Icon icon="settings" size={spacing.xl} color={colors.text} />
      </View>

      <View>
        <Text text={numberOfTasks?.toString()?.concat(" tasks")} size={"xs"} />
        <Text weight="bold" text={cardTitle} />
      </View>
    </View>
  )
})

// Styles
const $toDoInProgressCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.lg,
  justifyContent: "space-between",
})
