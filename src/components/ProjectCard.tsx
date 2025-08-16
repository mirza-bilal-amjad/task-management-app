import { FC } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { observer } from "mobx-react-lite"

import { Text } from "@/components"
import { CategoryStore } from "@/models/category-tasks/CategoryModel"
import { $styles, ThemedStyle, useAppTheme } from "@/theme"

interface ProjectCardProps {
  item: CategoryStore
}
export const ProjectCard: FC<ProjectCardProps> = observer(({ item: { id, name, description } }) => {
  const Router = useRouter()
  const { themed } = useAppTheme()
  // Define a themed style for the container

  const handleOnPress = () => {
    Router.push(`/categories/${id}`)
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={themed([$container, { backgroundColor: "pink" }])}
    >
      <View style={themed([$styles.row, $styles.jCSpaceBetween, $styles.gapSM, $styles.aIEnd])}>
        <View style={$styles.flex1}>
          <Text preset="formLabel" numberOfLines={2} text={name} />
        </View>
        <View>
          <View style={themed($daysContainer)}>
            <Text size="xxxs" weight="medium" text="6 days left" />
          </View>
        </View>
      </View>
      <View style={themed({ marginTop: 10 })}>
        <Text text={description} />
      </View>
    </TouchableOpacity>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral300,
  borderRadius: spacing.lg,
  padding: spacing.md,
})

const $daysContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary300,
  borderRadius: spacing.sm,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.xs,
})
