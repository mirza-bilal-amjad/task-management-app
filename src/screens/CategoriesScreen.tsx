import { FlatList, ViewStyle } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { observer } from "mobx-react-lite"

import { Screen, Text } from "@/components"
import { useStores } from "@/models"
import { useMemo } from "react"

export const CategoriesScreen = observer(() => {
  const Router = useRouter()
  const {
    categoriesStore: { categories },
  } = useStores()

  return (
    <Screen contentContainerStyle={$root} preset="fixed">
      <Text text="categories" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <Text onPress={() => Router.navigate(`/categories/${item.id}`)} text={item.name} />
        )}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
