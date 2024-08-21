import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Stack = createStackNavigator();

const Index = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Configurar canal de notificação para Android (opcional)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // Solicitar permissões
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission for notifications not granted');
      }
    };

    setupNotifications();

    // Inscrever-se para notificações recebidas
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack.Navigator initialRouteName="TaskList">
      <Stack.Screen 
        name="TaskList" 
        component={TaskList} 
        options={{ headerTitle: 'Lista de tarefas' }} // Altere o título aqui
      />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskForm} 
        options={{ headerTitle: 'Adicionar novas tarefas' }} // E aqui o título para o formulário
      />
    </Stack.Navigator>
  );
};

export default Index;
