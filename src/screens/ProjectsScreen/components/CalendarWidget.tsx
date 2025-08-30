import { FC } from "react"
import { FlatList, View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/theme/context"
import { CalendarDay } from "@/utils/dateUtils"

interface CalendarWidgetProps {
  calendarDays: CalendarDay[]
}

export const CalendarWidget: FC<CalendarWidgetProps> = ({ calendarDays }) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($calendarContainer)}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={calendarDays}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={themed([$calendarDay, item.isToday && $calendarDayActive])}>
            <Text
              text={item.dayName}
              size="xs"
              style={themed([$calendarDayText, item.isToday && $calendarDayTextActive])}
            />
            <Text
              text={item.day.toString()}
              weight="bold"
              style={themed([$calendarDayNumber, item.isToday && $calendarDayNumberActive])}
            />
          </View>
        )}
      />
    </View>
  )
}

// Styles
const $calendarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $calendarDay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginHorizontal: spacing.xs,
  borderRadius: spacing.md,
  minWidth: 60,
})

const $calendarDayActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $calendarDayText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $calendarDayTextActive: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $calendarDayNumber: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 4,
})

const $calendarDayNumberActive: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})