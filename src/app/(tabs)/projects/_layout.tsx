import { Stack } from "expo-router"

export default function ProjectsLayout() {
  return (
    <Stack screenOptions={{ title: "Projects", headerShown: false }}>
      <Stack.Screen name="[id]" options={{ title: "Project" }} />
    </Stack>
  )
}
