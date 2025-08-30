import { FlatList, Platform, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

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

import { TodayTasks, ToDoInProgressView } from "./components"

export const HomeScreen = observer(() => {
  const {
    themed,
    theme: { colors, spacing, isDark },
    setThemeContextOverride,
  } = useAppTheme()
  const {
    categoriesStore: { getRecentProjects, addProject },
    authStore: { user, logout },
  } = useStores()

  const handleAddProject = () => {
    addProject({
      name: "Once there was a fox. he was very thirsty. He flew Away, Once there was a fox. he was very thirsty",
      description: "Project Description",
    })
  }

  return (
    <Screen preset="auto" style={themed($container)}>
      <Header
        style={themed($header)}
        LeftActionComponent={
          <View style={$headerLeft}>
            {user?.displayName && (
              <Text
                numberOfLines={1}
                weight="medium"
                text={user?.displayName?.concat("!")}
                preset="heading"
              />
            )}
            <Text text="Today, 17 Oct" />
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
        contentContainerStyle={themed({
          paddingHorizontal: spacing.lg,
          gap: spacing.md,
          paddingBottom: spacing.lg,
        })}
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
})

const $headerRightComp: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  borderRadius: spacing.xxxl,
  backgroundColor: colors.palette.neutral300,
})

const $headerLeft: ViewStyle = {
  flex: 1,
}

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  marginTop: spacing.lg,
})

const $todoInProgressCont: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  flexBasis: 1,
  gap: spacing.xs,
})
