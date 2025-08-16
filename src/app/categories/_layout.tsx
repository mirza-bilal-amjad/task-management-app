import { Stack } from "expo-router"

export default function CategoriesLayout() {
  return (
    <Stack screenOptions={{ title: "Categories", headerShown: false }}>
      <Stack.Screen name="[id]" options={{ title: "Category" }} />
    </Stack>
  )
}
