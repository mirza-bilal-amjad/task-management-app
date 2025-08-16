import { useMemo } from "react"
import { useLocalSearchParams } from "expo-router"
import { observer } from "mobx-react-lite"
import { FlatList } from "react-native-gesture-handler"

import { Button, Screen, Text } from "@/components"
import { useStores } from "@/models"
import { $styles } from "@/theme"

export default observer(function Category() {
  const { id } = useLocalSearchParams()
  const {
    categoriesStore: { addTask, tasks },
  } = useStores()

  const getTasks = useMemo(() => {
    return () => tasks.filter((task) => task.categoryId === id?.toString())
  }, [tasks, id])

  const handleAddTask = () => {
    addTask({
      title: "New Task",
      description: "Task description",
      assignedPeople: [],
      categoryId: id?.toString() ?? "",
      dueDate: Date.now(),
      dueTime: "12:00",
      estimatedTime: 0,
    })
  }

  return (
    <Screen contentContainerStyle={$styles.flex1} safeAreaEdges={["top", "bottom"]}>
      <Text text={"Category with id " + id} />
      <Button text={"Add Task"} onPress={handleAddTask} />

      <FlatList
        data={getTasks()}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <Text
            onPress={() => console.log("Task pressed:", item.id)}
            text={item.title}
            key={item.id}
          />
        )}
      />
    </Screen>
  )
})
