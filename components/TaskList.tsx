import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

interface Task {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: Date;
}

const TaskList = ({ navigation }: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Button title="Adicionar tarefa" onPress={() => navigation.navigate('TaskForm', { addTask })} color="blue" />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text>Name: {item.name}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {item.date.toDateString()}</Text>
            <Text>Time: {item.time.toLocaleTimeString()}</Text>
            <Button
              title="Remover tarefa"
              onPress={() => removeTask(item.id)}
              color="red"
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
});

export default TaskList;
