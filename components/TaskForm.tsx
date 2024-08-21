import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const TaskForm = ({ route, navigation }: any) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { addTask } = route.params;

  const handleDateChange = (event: any, date: Date | undefined) => {
    const selectedDate = date || taskDate;
    setShowDatePicker(Platform.OS === 'ios');
    setTaskDate(selectedDate);
  };

  const handleTimeChange = (event: any, time: Date | undefined) => {
    const selectedTime = time || taskTime;
    setShowTimePicker(Platform.OS === 'ios');
    setTaskTime(selectedTime);
  };

  const handleSubmit = async () => {
    if (taskName) {
      const taskDateTime = new Date(taskDate);
      taskDateTime.setHours(taskTime.getHours());
      taskDateTime.setMinutes(taskTime.getMinutes());

      addTask({
        id: Math.random().toString(),
        name: taskName,
        description: taskDescription,
        date: taskDate,
        time: taskTime,
      });

      // Agendar notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Reminder for task: ${taskName}`,
        },
        trigger: taskDateTime,
      });

      navigation.goBack();
    } else {
      Alert.alert('Error', 'Task name is required');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da tarefa"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />
      <View style={styles.dateTimeContainer}>
        <Text>Date:</Text>
        <Button title="Data" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <View style={styles.dateTimeContainer}>
        <Text>Time:</Text>
        <Button title="Horas" onPress={() => setShowTimePicker(true)} />
        {showTimePicker && (
          <DateTimePicker
            value={taskTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      <Button title="adicionar tarefa" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
});

export default TaskForm;
