import { Platform } from "react-native"
import { Tabs } from "expo-router"

import { Icon } from "@/components"
import { useAppTheme } from "@/theme/context"

export default function TabLayout() {
  const { theme } = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.tintInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.separator,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 90 : 60,
          paddingBottom: Platform.OS === "ios" ? theme.spacing.lg : theme.spacing.sm,
          paddingTop: theme.spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.typography.primary.medium,
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Icon icon="view" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => <Icon icon="more" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
