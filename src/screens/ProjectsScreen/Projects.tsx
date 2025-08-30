import { FlatList, Platform, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import { Header, PressableIcon, ProjectCard, Screen, Text } from "@/components"
import { useStores } from "@/models"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"
import { generateCalendarDays, getCurrentDateInfo, getGreetingMessage } from "@/utils/dateUtils"
import { getTaskStatistics } from "@/utils/taskUtils"

import { CalendarWidget, TaskStatusBadge, TaskSummary } from "./components"

export const ProjectsScreen = observer(() => {
  const {
    themed,
    theme: { colors, isDark },
    setThemeContextOverride,
  } = useAppTheme()
  const {
    categoriesStore: { categories, getTodoTasks, getDueTasks, tasks },
    authStore: { user },
  } = useStores()

  // Get date information using utility functions
  const { currentDay, currentMonth } = getCurrentDateInfo()
  const calendarDays = generateCalendarDays()

  // Get task statistics using utility function
  const { todoCount, inProgressCount, underReviewCount } = getTaskStatistics(
    tasks,
    getTodoTasks,
    getDueTasks,
  )

  // Get greeting message using utility function
  const greetingMessage = getGreetingMessage(user?.displayName || undefined)

  return (
    <Screen style={themed($container)}>
      {/* Header */}
      <Header
        style={themed($header)}
        LeftActionComponent={
          <View style={$headerLeft}>
            <Text text={greetingMessage} preset="heading" style={themed($greeting)} />
            <Text
              text={`Today, ${currentDay} ${currentMonth}`}
              size="sm"
              style={themed($dateText)}
            />
          </View>
        }
        RightActionComponent={
          <PressableIcon
            activeOpacity={0.8}
            icon="bell"
            size={24}
            onPress={() => setThemeContextOverride(isDark ? "light" : "dark")}
            containerStyle={themed($notificationIcon)}
          />
        }
      />

      {/* Calendar Widget */}
      <CalendarWidget calendarDays={calendarDays} />

      {/* Task Status Badges */}
      <View style={themed($badgesContainer)}>
        <TaskStatusBadge title="To do" count={todoCount} type="todo" />
        <TaskStatusBadge title="In progress" count={inProgressCount} type="progress" />
        <TaskStatusBadge title="Under review" count={underReviewCount} type="review" />
      </View>

      {/* Task Summary */}
      <TaskSummary taskCount={tasks.length} colors={colors} />

      {/* Projects List */}
      <FlatList
        data={categories}
        scrollEnabled={false}
        contentContainerStyle={themed($projectsList)}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <ProjectCard
            id={item.id}
            name={item.name}
            description={item.description}
            tasks={[]}
            createdAt={Date.now()}
          />
        )}
      />
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.lg,
  marginTop: spacing.lg,
})

const $headerLeft: ViewStyle = {
  flex: 1,
}

const $greeting: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 24,
  lineHeight: 32,
})

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 4,
})

const $notificationIcon: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.sm,
  borderRadius: spacing.lg,
  backgroundColor: colors.palette.neutral300,
})

const $badgesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  marginBottom: spacing.xl,
})

const $projectsList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.lg,
  paddingBottom: spacing.xxl,
})
