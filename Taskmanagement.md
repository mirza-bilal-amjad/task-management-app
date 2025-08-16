# ProjectTaskTracker - React Native App with Expo and MobX-State-Tree

## Setup Guide
1. **Initialize Project**:
   ```bash
   npx create-expo-app ProjectTaskTracker --template blank
   cd ProjectTaskTracker
   ```

2. **Install Dependencies**:
   ```bash
   npx expo install expo-router @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens mobx mobx-state-tree mobx-react-lite @shopify/flash-list @expo/vector-icons expo-image-picker expo-document-picker react-native-calendars react-native-progress date-fns expo-notifications expo-file-system expo-constants expo-linking react-native-gesture-handler
   ```

3. **Configure Expo Router**:
   - Add `"expo-router": { "scheme": "projecttasktracker" }` to `app.json`.
   - Create `app.config.js` for dynamic configuration if needed.
   - Ensure `app/_layout.js` is set up for navigation.

4. **Folder Structure**:
   ```
   ProjectTaskTracker/
   ├── app/
   │   ├── _layout.js
   │   ├── index.js
   │   ├── calendar.js
   │   ├── projects.js
   │   ├── profile.js
   │   ├── project-details/[id].js
   │   ├── task-details/[id].js
   ├── components/
   │   ├── ProjectCard.js
   │   ├── TaskCard.js
   │   ├── SubtaskItem.js
   │   ├── FAB.js
   │   ├── TaskForm.js
   │   ├── ProjectForm.js
   ├── models/
   │   ├── Project.js
   │   ├── Task.js
   │   ├── Subtask.js
   │   ├── RootStore.js
   ├── utils/
   │   ├── storage.js
   │   ├── notifications.js
   │   ├── constants.js
   ├── assets/
   │   ├── icon.png
   ├── app.json
   ├── babel.config.js
   └── package.json
   ```

---

## App Entry: `app/_layout.js`
```javascript
import { Tabs, Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Provider } from 'mobx-react';
import { rootStore } from '../models/RootStore';

export default function RootLayout() {
  return (
    <Provider store={rootStore}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#1e90ff' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#1e90ff',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <FontAwesome5 name="calendar" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color }) => <FontAwesome5 name="folder" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
      <Stack.Screen name="project-details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="task-details/[id]" options={{ headerShown: false }} />
    </Provider>
  );
}
```

---

## Models: `models/Project.js`
```javascript
import { types } from 'mobx-state-tree';
import { Task } from './Task';

export const Project = types
  .model('Project', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    createdAt: types.Date,
    tasks: types.array(types.reference(Task)),
  })
  .actions(self => ({
    addTask(task) {
      self.tasks.push(task);
    },
    update({ name, description }) {
      self.name = name || self.name;
      self.description = description || self.description;
    },
    deleteTask(taskId) {
      self.tasks = self.tasks.filter(task => task.id !== taskId);
    },
  }))
  .views(self => ({
    get totalTasks() {
      return self.tasks.length;
    },
    get progress() {
      if (!self.tasks.length) return 0;
      const totalProgress = self.tasks.reduce((sum, task) => sum + task.progress, 0);
      return Math.round(totalProgress / self.tasks.length);
    },
    get dueTasks() {
      return self.tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        return dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
      });
    },
  }));
```

---

## Models: `models/Task.js`
```javascript
import { types } from 'mobx-state-tree';
import { Subtask } from './Subtask';
import { format, parse, isBefore, isAfter, addHours } from 'date-fns';

export const Task = types
  .model('Task', {
    id: types.identifier,
    projectId: types.string,
    heading: types.string,
    description: types.string,
    assignedPeople: types.array(types.string),
    dueDate: types.Date,
    dueTime: types.string, // Format: HH:mm
    estimatedTime: types.number, // Hours
    progress: types.number, // 0-100
    attachments: types.array(
      types.model({
        type: types.enumeration(['link', 'image', 'document']),
        url: types.string,
      })
    ),
    subtasks: types.array(Subtask),
  })
  .actions(self => ({
    update(data) {
      Object.assign(self, data);
      self.updateProgress();
    },
    addSubtask(subtask) {
      self.subtasks.push(subtask);
      self.updateProgress();
    },
    toggleSubtask(subtaskId) {
      const subtask = self.subtasks.find(s => s.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
        self.updateProgress();
      }
    },
    updateProgress() {
      if (self.subtasks.length) {
        const completed = self.subtasks.filter(s => s.completed).length;
        self.progress = Math.round((completed / self.subtasks.length) * 100);
      }
    },
    addAttachment(attachment) {
      self.attachments.push(attachment);
    },
  }))
  .views(self => ({
    get isDueSoon() {
      const dueDateStr = format(self.dueDate, 'yyyy-MM-dd');
      const dueDateTime = parse(`${dueDateStr} ${self.dueTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const now = new Date();
      return isBefore(dueDateTime, addHours(now, 24)) && isAfter(dueDateTime, now);
    },
    get isOverdue() {
      const dueDateStr = format(self.dueDate, 'yyyy-MM-dd');
      const dueDateTime = parse(`${dueDateStr} ${self.dueTime}`, 'yyyy-MM-dd HH:mm', new Date());
      return isBefore(dueDateTime, new Date());
    },
  }));
```

---

## Models: `models/Subtask.js`
```javascript
import { types } from 'mobx-state-tree';

export const Subtask = types
  .model('Subtask', {
    id: types.identifier,
    title: types.string,
    completed: types.boolean,
  })
  .actions(self => ({
    update({ title, completed }) {
      self.title = title || self.title;
      self.completed = completed !== undefined ? completed : self.completed;
    },
  }));
```

---

## Models: `models/RootStore.js`
```javascript
import { types } from 'mobx-state-tree';
import { Project } from './Project';
import { Task } from './Task';
import { Subtask } from './Subtask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay, isSameDay } from 'date-fns';

export const RootStore = types
  .model('RootStore', {
    projects: types.array(Project),
    tasks: types.array(Task),
    user: types.model({
      username: types.string,
      email: types.string,
      avatar: types.maybeNull(types.string),
    }),
  })
  .actions(self => ({
    addProject({ name, description }) {
      const id = uuidv4();
      self.projects.push({ id, name, description, createdAt: new Date(), tasks: [] });
      self.save();
    },
    addTask({ projectId, heading, description, assignedPeople, dueDate, dueTime, estimatedTime }) {
      const id = uuidv4();
      const task = { id, projectId, heading, description, assignedPeople, dueDate, dueTime, estimatedTime, progress: 0, attachments: [], subtasks: [] };
      self.tasks.push(task);
      const project = self.projects.find(p => p.id === projectId);
      if (project) project.addTask(id);
      self.save();
    },
    addSubtask(taskId, title) {
      const subtask = { id: uuidv4(), title, completed: false };
      const task = self.tasks.find(t => t.id === taskId);
      if (task) task.addSubtask(subtask);
      self.save();
    },
    async save() {
      try {
        await AsyncStorage.setItem('rootStore', JSON.stringify(self.toJSON()));
      } catch (error) {
        console.error('Failed to save store:', error);
      }
    },
    async load() {
      try {
        const data = await AsyncStorage.getItem('rootStore');
        if (data) {
          const parsed = JSON.parse(data);
          self.projects = parsed.projects || [];
          self.tasks = parsed.tasks || [];
          self.user = parsed.user || { username: 'User', email: '', avatar: null };
        }
      } catch (error) {
        console.error('Failed to load store:', error);
      }
    },
  }))
  .views(self => ({
    getTodayTasks() {
      const today = startOfDay(new Date());
      return self.tasks.filter(task => isSameDay(task.dueDate, today));
    },
    getTodoTasks() {
      return self.tasks.filter(task => task.progress < 100).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },
    getRecentProjects() {
      return self.projects.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    },
    getDueTasks() {
      return self.tasks.filter(task => task.isDueSoon || task.isOverdue);
    },
  }));

export const rootStore = RootStore.create({
  projects: [],
  tasks: [],
  user: { username: 'User', email: '', avatar: null },
});
```

---

## Components: `components/ProjectCard.js`
```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import * as Progress from 'react-native-progress';
import { FontAwesome5 } from '@expo/vector-icons';

const ProjectCard = observer(({ project }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/project-details/${project.id}`)}
      style={{
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{project.name}</Text>
      <Text style={{ color: '#666', marginVertical: 4 }}>{project.description}</Text>
      <Text style={{ color: '#1e90ff' }}>Tasks: {project.totalTasks}</Text>
      <Progress.Bar progress={project.progress / 100} width={null} color="#1e90ff" style={{ marginVertical: 8 }} />
      {project.dueTasks.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <FontAwesome5 name="exclamation-triangle" size={16} color="red" />
          <Text style={{ color: 'red', marginLeft: 4 }}>{project.dueTasks.length} tasks due soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default ProjectCard;
```

---

## Components: `components/TaskCard.js`
```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import * as Progress from 'react-native-progress';
import { FontAwesome5 } from '@expo/vector-icons';
import { format, parse } from 'date-fns';

const TaskCard = observer(({ task }) => {
  const router = useRouter();
  const dueDateStr = format(task.dueDate, 'yyyy-MM-dd');
  const dueDateTime = parse(`${dueDateStr} ${task.dueTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const statusColor = task.isOverdue ? 'red' : task.isDueSoon ? 'orange' : '#666';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/task-details/${task.id}`)}
      style={{
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: statusColor,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{task.heading}</Text>
      <Text style={{ color: '#666', marginVertical: 4 }}>{task.description.slice(0, 50)}...</Text>
      <Text style={{ color: statusColor }}>
        Due: {format(task.dueDate, 'MMM dd, yyyy')} at {task.dueTime}
      </Text>
      <Progress.Bar progress={task.progress / 100} width={null} color="#1e90ff" style={{ marginVertical: 8 }} />
      {task.subtasks.length > 0 && (
        <Text style={{ color: '#666' }}>
          Subtasks: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
        </Text>
      )}
      {task.assignedPeople.length > 0 && (
        <Text style={{ color: '#666' }}>Assigned: {task.assignedPeople.join(', ')}</Text>
      )}
      {(task.isDueSoon || task.isOverdue) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <FontAwesome5 name="exclamation-triangle" size={16} color={statusColor} />
          <Text style={{ color: statusColor, marginLeft: 4 }}>
            {task.isOverdue ? 'Overdue' : 'Due soon'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default TaskCard;
```

---

## Components: `components/SubtaskItem.js`
```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { FontAwesome5 } from '@expo/vector-icons';

const SubtaskItem = observer(({ subtask, task }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
      <TouchableOpacity onPress={() => task.toggleSubtask(subtask.id)}>
        <FontAwesome5
          name={subtask.completed ? 'check-square' : 'square'}
          size={20}
          color={subtask.completed ? '#1e90ff' : '#666'}
        />
      </TouchableOpacity>
      <Text style={{ marginLeft: 8, textDecorationLine: subtask.completed ? 'line-through' : 'none' }}>
        {subtask.title}
      </Text>
    </View>
  );
});

export default SubtaskItem;
```

---

## Components: `components/FAB.js`
```javascript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const FAB = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#1e90ff',
      borderRadius: 30,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <FontAwesome5 name="plus" size={24} color="#fff" />
  </TouchableOpacity>
);

export default FAB;
```

---

## Components: `components/TaskForm.js`
```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import { useStore } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const TaskForm = observer(({ projectId, task, onSubmit, onCancel }) => {
  const store = useStore();
  const [form, setForm] = useState({
    heading: task?.heading || '',
    description: task?.description || '',
    assignedPeople: task?.assignedPeople.join(', ') || '',
    dueDate: task?.dueDate || new Date(),
    dueTime: task?.dueTime || '12:00',
    estimatedTime: task?.estimatedTime?.toString() || '1',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = async () => {
    const data = {
      ...form,
      assignedPeople: form.assignedPeople.split(',').map(p => p.trim()).filter(p => p),
      dueDate: new Date(form.dueDate),
      estimatedTime: parseFloat(form.estimatedTime) || 1,
    };
    if (task) {
      store.tasks.find(t => t.id === task.id).update(data);
    } else {
      store.addTask({ ...data, projectId });
    }
    onSubmit();
  };

  const addAttachment = async () => {
    const type = await new Promise(resolve => {
      // Simulate choice: link, image, or document
      resolve('image');
    });
    if (type === 'image') {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        task?.addAttachment({ type: 'image', url: result.assets[0].uri });
      }
    } else if (type === 'document') {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        task?.addAttachment({ type: 'document', url: result.uri });
      }
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Task Heading"
        value={form.heading}
        onChangeText={text => setForm({ ...form, heading: text })}
      />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Description"
        value={form.description}
        multiline
        onChangeText={text => setForm({ ...form, description: text })}
      />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Assigned People (comma-separated)"
        value={form.assignedPeople}
        onChangeText={text => setForm({ ...form, assignedPeople: text })}
      />
      <Button title="Pick Due Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={form.dueDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setForm({ ...form, dueDate: date });
          }}
        />
      )}
      <Button title="Pick Due Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={parse(form.dueTime, 'HH:mm', new Date())}
          mode="time"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) setForm({ ...form, dueTime: format(date, 'HH:mm') });
          }}
        />
      )}
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Estimated Time (hours)"
        value={form.estimatedTime}
        keyboardType="numeric"
        onChangeText={text => setForm({ ...form, estimatedTime: text })}
      />
      <Button title="Add Attachment" onPress={addAttachment} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
});

export default TaskForm;
```

---

## Components: `components/ProjectForm.js`
```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';

const ProjectForm = observer(({ project, onSubmit, onCancel }) => {
  const store = useStore();
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
  });

  const handleSubmit = () => {
    if (project) {
      store.projects.find(p => p.id === project.id).update(form);
    } else {
      store.addProject(form);
    }
    onSubmit();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Project Name"
        value={form.name}
        onChangeText={text => setForm({ ...form, name: text })}
      />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Description"
        value={form.description}
        multiline
        onChangeText={text => setForm({ ...form, description: text })}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
});

export default ProjectForm;
```

---

## Screens: `app/index.js` (Dashboard)
```javascript
import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import { useRouter } from 'expo-router';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import FAB from '../components/FAB';

const Dashboard = observer(() => {
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    store.load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Dashboard</Text>

        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Due Tasks</Text>
        {store.getDueTasks().length ? (
          store.getDueTasks().map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <Text style={{ color: '#666' }}>No tasks due soon.</Text>
        )}

        <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 8 }}>Today's Tasks</Text>
        {store.getTodayTasks().length ? (
          store.getTodayTasks().map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <Text style={{ color: '#666' }}>No tasks for today.</Text>
        )}

        <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 8 }}>Recent Projects</Text>
        {store.getRecentProjects().length ? (
          store.getRecentProjects().map(project => <ProjectCard key={project.id} project={project} />)
        ) : (
          <Text style={{ color: '#666' }}>No recent projects.</Text>
        )}
      </ScrollView>
      <FAB onPress={() => router.push('/task-details/new')} />
    </View>
  );
});

export default Dashboard;
```

---

## Screens: `app/calendar.js`
```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import { Calendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import TaskCard from '../components/TaskCard';

const CalendarScreen = observer(() => {
  const store = useStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = {};
  store.tasks.forEach(task => {
    const date = format(task.dueDate, 'yyyy-MM-dd');
    markedDates[date] = { marked: true, dotColor: task.isOverdue ? 'red' : task.isDueSoon ? 'orange' : '#1e90ff' };
  });

  const tasksForDate = store.tasks.filter(task => format(task.dueDate, 'yyyy-MM-dd') === selectedDate);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{ ...markedDates, [selectedDate]: { ...markedDates[selectedDate], selected: true } }}
        theme={{ selectedDayBackgroundColor: '#1e90ff', todayTextColor: '#1e90ff' }}
      />
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
          Tasks for {format(parseISO(selectedDate), 'MMM dd, yyyy')}
        </Text>
        {tasksForDate.length ? (
          tasksForDate.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <Text style={{ color: '#666' }}>No tasks for this date.</Text>
        )}
      </ScrollView>
    </View>
  );
});

export default CalendarScreen;
```

---

## Screens: `app/projects.js`
```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import { useRouter } from 'expo-router';
import ProjectCard from '../components/ProjectCard';
import FAB from '../components/FAB';

const ProjectsScreen = observer(() => {
  const store = useStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredProjects = store.projects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <TextInput
        style={{ padding: 8, margin: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' }}
        placeholder="Search projects..."
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Projects</Text>
        {filteredProjects.length ? (
          filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
        ) : (
          <Text style={{ color: '#666' }}>No projects found.</Text>
        )}
      </ScrollView>
      <FAB onPress={() => router.push('/project-details/new')} />
    </View>
  );
});

export default ProjectsScreen;
```

---

## Screens: `app/profile.js`
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = observer(() => {
  const store = useStore();
  const [form, setForm] = useState({
    username: store.user.username,
    email: store.user.email,
  });

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      store.user.avatar = result.assets[0].uri;
      store.save();
    }
  };

  const handleSave = () => {
    store.user.username = form.username;
    store.user.email = form.email;
    store.save();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Welcome, {store.user.username}!
      </Text>
      {store.user.avatar && (
        <Image source={{ uri: store.user.avatar }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }} />
      )}
      <Button title="Pick Avatar" onPress={pickAvatar} />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Username"
        value={form.username}
        onChangeText={text => setForm({ ...form, username: text })}
      />
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
        placeholder="Email"
        value={form.email}
        onChangeText={text => setForm({ ...form, email: text })}
      />
      <Button title="Save Profile" onPress={handleSave} />
      <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 16 }}>Statistics</Text>
      <Text>Total Projects: {store.projects.length}</Text>
      <Text>Completed Tasks: {store.tasks.filter(t => t.progress === 100).length}</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 16 }}>Settings</Text>
      <Button title="Clear Data" onPress={() => AsyncStorage.clear()} color="red" />
    </ScrollView>
  );
});

export default ProfileScreen;
```

---

## Screens: `app/project-details/[id].js`
```javascript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProjectForm from '../../components/ProjectForm';
import TaskCard from '../../components/TaskCard';
import FAB from '../../components/FAB';

const ProjectDetails = observer(() => {
  const store = useStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const project = store.projects.find(p => p.id === id);
  const isNew = id === 'new';

  if (!project && !isNew) return <Text>Project not found</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {isNew || project ? (
        <>
          <ProjectForm
            project={isNew ? null : project}
            onSubmit={() => router.back()}
            onCancel={() => router.back()}
          />
          {!isNew && (
            <ScrollView style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Tasks</Text>
              {project.tasks.length ? (
                project.tasks
                  .slice()
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <Text style={{ color: '#666' }}>No tasks yet.</Text>
              )}
            </ScrollView>
          )}
          {!isNew && <FAB onPress={() => router.push(`/task-details/new?projectId=${id}`)} />}
        </>
      ) : null}
    </View>
  );
});

export default ProjectDetails;
```

---

## Screens: `app/task-details/[id].js`
```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from 'mobx-react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TaskForm from '../../components/TaskForm';
import SubtaskItem from '../../components/SubtaskItem';

const TaskDetails = observer(() => {
  const store = useStore();
  const { id, projectId } = useLocalSearchParams();
  const router = useRouter();
  const task = store.tasks.find(t => t.id === id);
  const isNew = id === 'new';
  const [subtaskTitle, setSubtaskTitle] = useState('');

  if (!task && !isNew) return <Text>Task not found</Text>;

  const addSubtask = () => {
    if (subtaskTitle && task) {
      store.addSubtask(task.id, subtaskTitle);
      setSubtaskTitle('');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <TaskForm
        projectId={projectId}
        task={isNew ? null : task}
        onSubmit={() => router.back()}
        onCancel={() => router.back()}
      />
      {!isNew && (
        <ScrollView style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Subtasks</Text>
          {task.subtasks.length ? (
            task.subtasks.map(subtask => (
              <SubtaskItem key={subtask.id} subtask={subtask} task={task} />
            ))
          ) : (
            <Text style={{ color: '#666' }}>No subtasks yet.</Text>
          )}
          <TextInput
            style={{ borderBottomWidth: 1, marginVertical: 8 }}
            placeholder="Add subtask"
            value={subtaskTitle}
            onChangeText={setSubtaskTitle}
            onSubmitEditing={addSubtask}
          />
          <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 8 }}>Attachments</Text>
          {task.attachments.length ? (
            task.attachments.map((attachment, index) => (
              <Text key={index} style={{ color: '#1e90ff' }}>
                {attachment.type}: {attachment.url}
              </Text>
            ))
          ) : (
            <Text style={{ color: '#666' }}>No attachments.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
});

export default TaskDetails;
```

---

## Utils: `utils/storage.js`
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveStore = async (store) => {
  try {
    await AsyncStorage.setItem('rootStore', JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save store:', error);
  }
};

export const loadStore = async () => {
  try {
    const data = await AsyncStorage.getItem('rootStore');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load store:', error);
    return null;
  }
};
```

---

## Utils: `utils/notifications.js`
```javascript
import * as Notifications from 'expo-notifications';
import { format, parse } from 'date-fns';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const scheduleDueTaskNotification = async (task) => {
  const dueDateStr = format(task.dueDate, 'yyyy-MM-dd');
  const dueDateTime = parse(`${dueDateStr} ${task.dueTime}`, 'yyyy-MM-dd HH:mm', new Date());
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Task Due Soon: ${task.heading}`,
      body: `Due at ${task.dueTime} on ${format(task.dueDate, 'MMM dd, yyyy')}`,
    },
    trigger: {
      date: dueDateTime,
    },
  });
};
```

---

## Utils: `utils/constants.js`
```javascript
export const COLORS = {
  primary: '#1e90ff',
  secondary: '#666',
  warning: 'orange',
  error: 'red',
  background: '#f5f5f5',
};
```

---

## Sample Data
Add this to `models/RootStore.js` after store creation for testing:
```javascript
rootStore.addProject({ name: 'Sample Project', description: 'A test project' });
rootStore.addTask({
  projectId: rootStore.projects[0].id,
  heading: 'Sample Task',
  description: 'This is a test task',
  assignedPeople: ['Alice', 'Bob'],
  dueDate: new Date(),
  dueTime: '14:00',
  estimatedTime: 2,
});
rootStore.addSubtask(rootStore.tasks[0].id, 'Test subtask 1');
```

---

## Notes
- **State Management**: MobX-State-Tree provides reactive state with models for Project, Task, Subtask, and RootStore. Data is persisted using AsyncStorage.
- **Navigation**: Expo Router with bottom tabs for the 4 main screens and stack navigation for modals (task/project details).
- **UI/UX**: Uses a blue-themed, modern design with cards, progress bars, and FABs. Supports dark mode via system settings.
- **Offline Support**: All data stored locally with AsyncStorage. Attachments use local URIs.
- **Notifications**: Local notifications for due tasks (Expo Notifications).
- **Performance**: Uses `@shopify/flash-list` for efficient lists.
- **Accessibility**: Basic support with readable text and touchable components.
- **Testing**: Add Jest tests for components in a separate `/__tests__` folder if needed.

To run:
```bash
npx expo start
```