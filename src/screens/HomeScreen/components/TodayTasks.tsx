import { FC } from "react"
import { FlatList, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import { Text } from "@/components"
import { useStores } from "@/models"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"

export const TodayTasks: FC<{}> = observer(() => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const {
    categoriesStore: { getTodaysRecentTasks },
  } = useStores()

  return (
    <View style={themed($todayTasksContainer)}>
      <FlatList
        scrollEnabled={false}
        ListHeaderComponent={
          <View style={themed($todayTasksHeader)}>
            <Text size="xl" weight="bold" text={"Today"} />
          </View>
        }
        data={getTodaysRecentTasks()}
        ItemSeparatorComponent={() => <View style={themed($todayTasksSeparator)} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          return (
            <View key={index}>
              <Text size="xxs" text={item.dueTime} style={{ color: colors.text }} />
              <Text size="xs" weight="bold" text={item.title} numberOfLines={2} />
            </View>
          )
        }}
      />
    </View>
  )
})

// Styles
const $todayTasksContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.palette.accent200,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.lg,
})

const $todayTasksHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.lg,
})

const $todayTasksSeparator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderBottomWidth: 0.5,
  borderColor: colors.separator,
  marginVertical: 10,
})
