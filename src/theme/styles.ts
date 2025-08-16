import { TextStyle, ViewStyle } from "react-native"
import { opacity } from "react-native-reanimated/lib/typescript/Colors"
import { spacing } from "./spacing"
import { ThemedStyle } from "."

/* Use this file to define styles that are used in multiple places in your app. */
export const $styles = {
  row: { flexDirection: "row" } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,
  // Justify Content
  jCCenter: { justifyContent: "center" } as ViewStyle,
  jCSpaceBetween: { justifyContent: "space-between" } as ViewStyle,
  jCSpaceAround: { justifyContent: "space-around" } as ViewStyle,
  jCSpaceEvenly: { justifyContent: "space-evenly" } as ViewStyle,
  jCStart: { justifyContent: "flex-start" } as ViewStyle,
  jCEnd: { justifyContent: "flex-end" } as ViewStyle,
  // Align Items
  aICenter: { alignItems: "center" } as ViewStyle,
  aIStart: { alignItems: "flex-start" } as ViewStyle,
  aIEnd: { alignItems: "flex-end" } as ViewStyle,
  aIStretch: { alignItems: "stretch" } as ViewStyle,
  aIBaseLine: { alignItems: "baseline" } as ViewStyle,
  // Opacity
  opacity05: { opacity: 0.5 } as ViewStyle,
  opacity06: { opacity: 0.6 } as ViewStyle,
  opacity07: { opacity: 0.7 } as ViewStyle,
  opacity08: { opacity: 0.8 } as ViewStyle,
  opacity09: { opacity: 0.9 } as ViewStyle,
  // Text
  disabled05: { opacity: 0.5 } as TextStyle,
  disabled06: { opacity: 0.6 } as TextStyle,
  disabled07: { opacity: 0.7 } as TextStyle,
  disabled08: { opacity: 0.8 } as TextStyle,
  disabled09: { opacity: 0.9 } as TextStyle,
  // Gap
  gapXXXS: (({ spacing }) => ({ gap: spacing.xxxs })) as ThemedStyle<ViewStyle>,
  gapXXS: (({ spacing }) => ({ gap: spacing.xxs })) as ThemedStyle<ViewStyle>,
  gapXS: (({ spacing }) => ({ gap: spacing.xs })) as ThemedStyle<ViewStyle>,
  gapSM: (({ spacing }) => ({ gap: spacing.sm })) as ThemedStyle<ViewStyle>,
  gapMD: (({ spacing }) => ({ gap: spacing.md })) as ThemedStyle<ViewStyle>,
  gapLG: (({ spacing }) => ({ gap: spacing.lg })) as ThemedStyle<ViewStyle>,
  gapXL: (({ spacing }) => ({ gap: spacing.xl })) as ThemedStyle<ViewStyle>,
  gapXXL: (({ spacing }) => ({ gap: spacing.xxl })) as ThemedStyle<ViewStyle>,
  gapXXXL: (({ spacing }) => ({ gap: spacing.xxxl })) as ThemedStyle<ViewStyle>,
  // Flex
  toggleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as ViewStyle,
}
