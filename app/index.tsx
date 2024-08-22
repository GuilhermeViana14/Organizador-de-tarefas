import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Login from '../components/Login';
import Cadastro from '../components/Cadastro';

const Stack = createStackNavigator();

const Index = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission for notifications not granted');
      }
    };

    setupNotifications();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#87CEEB" // Azul claro
      />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Oculta o cabeçalho
        />
        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro} 
          options={{ headerShown: false }} // Oculta o cabeçalho
        />
        <Stack.Screen 
          name="TaskList" 
          component={TaskList} 
          options={{ 
            headerShown: false, // Oculta o cabeçalho
          }} 
        />
        <Stack.Screen 
          name="TaskForm" 
          component={TaskForm} 
          options={{ headerShown: false }} // Oculta o cabeçalho
        />
      </Stack.Navigator>
    </>
  );
};

export default Index;
