import { observer } from "mobx-react-lite"
import { FC } from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"

import {
  Button,
  EmptyState,
  Header,
  Icon,
  PressableIcon,
  ProjectCard,
  Screen,
  Text,
} from "@/components"
import { useStores } from "@/models"
import { $styles, ThemedStyle, typography } from "@/theme"
import { useAppTheme } from "@/theme/context"

export const DashboardScreen = observer(() => {
  const {
    themed,
    theme: { colors, spacing, isDark },
    setThemeContextOverride,
  } = useAppTheme()
  const {
    categoriesStore: {
      getRecentProjects,
      getTodaysRecentTasks,
      addProject,
      getDueTasks,
      getTodoTasks,
    },
    authStore: { user, logout },
  } = useStores()

  const handleAddProject = () => {
    addProject({
      name: "New Project",
      description: "Project Description",
    })
  }

  const TodayTasks: FC<{}> = observer(() => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.palette.accent200,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.md,
          borderRadius: spacing.lg,
        }}
      >
        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={
            <View style={{ paddingBottom: spacing.lg }}>
              <Text size="xl" weight="bold" text={"Today"} />
            </View>
          }
          data={getTodaysRecentTasks()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: colors.separator,
                marginVertical: 10,
              }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View key={index}>
              <Text size="xxs" text={item.dueTime} style={{ color: colors.text }} />
              <Text size="xs" weight="bold" text={item.title} numberOfLines={2} />
            </View>
          )}
        />
      </View>
    )
  })

  const ToDoInProgressView: FC<{
    type?: "todo" | "in-progress"
  }> = observer(({ type }) => {
    const backgroundColor =
      type === "todo" ? colors.palette.primary200 : colors.palette.secondary200
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

  return (
    <Screen style={themed($container)} safeAreaEdges={["bottom"]} preset="scroll">
      <Header
        style={themed($header)}
        LeftActionComponent={
          <View style={$headerLeft}>
            <Text text="Good Evening," />
            {user?.displayName && (
              <Text
                numberOfLines={1}
                weight="medium"
                text={user?.displayName?.concat("!")}
                preset="heading"
              />
            )}
          </View>
        }
        RightActionComponent={
          <PressableIcon
            activeOpacity={0.8}
            icon="bell"
            size={24}
            onPress={() => setThemeContextOverride(isDark ? "light" : "dark")}
            containerStyle={themed($headerRightComp)}
          />
        }
      />
      {/* Today Tasks & To-Do List */}
      <View
        style={[
          $styles.row,
          {
            gap: spacing.xs,
            paddingHorizontal: spacing.lg,
            marginTop: spacing.xxl,
          },
        ]}
      >
        <View style={$styles.flex1}>
          <TodayTasks />
        </View>
        <View style={themed($todoInProgressCont)}>
          <ToDoInProgressView type="todo" />
          <ToDoInProgressView type="in-progress" />
        </View>
      </View>

      {/* Recent Project Container */}

      <View
        style={{
          padding: spacing.lg,
          ...$styles.row,
          ...$styles.jCSpaceBetween,
          ...$styles.aICenter,
        }}
      >
        <View style={$styles.flex1}>
          <Text size="xl" weight="bold" text="Recent Projects" />
          <Text
            size="xxs"
            weight="bold"
            text={`Currently you have ${getRecentProjects().length} projects`}
          />
        </View>
        <Button
          onPress={handleAddProject}
          style={{
            minHeight: 0,
            height: 35,
            paddingVertical: spacing.xxs,
            borderRadius: spacing.xxxl,
            gap: spacing.xxs,
          }}
          textStyle={{
            fontSize: spacing.md,
            fontFamily: typography.primary.normal,
          }}
          LeftAccessory={() => (
            <Icon style={{ transform: [{ rotate: "45deg" }] }} icon="x" size={spacing.md} />
          )}
          text="Add"
        />
      </View>
      <FlatList
        data={
          getRecentProjects() ?? [
            { bgColor: colors.palette.primary200 },
            {
              bgColor: colors.palette.secondary200,
            },
            {
              bgColor: colors.palette.accent200,
            },
          ]
        }
        contentContainerStyle={themed({ paddingHorizontal: spacing.lg, gap: spacing.md })}
        ListEmptyComponent={() => (
          <EmptyState
            button="Logout"
            buttonOnPress={logout}
            buttonStyle={{
              alignSelf: "center",
              paddingInline: 20,
            }}
            style={{ marginBottom: spacing.xl }}
          />
        )}
        scrollEnabled={false}
        renderItem={({ item }) => <ProjectCard item={item} />}
      />
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
const $headerRightComp: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  borderRadius: spacing.xxxl,
  backgroundColor: colors.palette.neutral300,
})

const $headerLeft: ViewStyle = {
  flex: 1,
}
const $categoryCard: ViewStyle = {
  backgroundColor: "#444",
  borderRadius: 8,
  marginRight: 8,
  padding: 16,
}

const $seeAll: TextStyle = { color: "#007AFF" }

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  marginTop: spacing.lg,
})

const $todoInProgressCont: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  flexBasis: 1,
  gap: spacing.xs,
})

const $toDoInProgressCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,

  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.lg,
  justifyContent: "space-between",
})
