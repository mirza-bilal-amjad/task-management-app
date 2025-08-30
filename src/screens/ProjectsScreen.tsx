import { FlatList, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { observer } from "mobx-react-lite"

import { Screen, Text } from "@/components"
import { useStores } from "@/models"

export const ProjectsScreen = observer(() => {
  const Router = useRouter()
  const {
    categoriesStore: { categories },
  } = useStores()

  return (
    <Screen contentContainerStyle={$root} preset="fixed">
      <Text text="projects" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <Text onPress={() => Router.push(`/projects/${item.id}`)} text={item.name} />
        )}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
