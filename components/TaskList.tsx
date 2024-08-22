import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Pressable, Animated, Button } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Task {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  username: string;
}

const TaskList = ({ navigation, route }: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(-250)); // Inicialmente fora da tela
  const { username } = route.params;

  const loadTasks = useCallback(async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3001/tasks', {
        params: { username },
      });
      setTasks(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    }
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const addTask = async (task: Task) => {
    try {
      await axios.post('http://10.0.2.2:3001/tasks', task);
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  const removeTask = async (id: string) => {
    try {
      await axios.delete(`http://10.0.2.2:3001/tasks/${id}`);
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a tarefa');
    }
  };

  const handleOutsidePress = () => {
    setDrawerVisible(false);
    Animated.timing(drawerAnimation, {
      toValue: -250, // Desliza para fora da tela
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnimation, {
      toValue: 0, // Posiciona a navbar visível
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Botão para abrir o menu */}
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Icon name="menu" size={30} color="#87CEEB" />
      </TouchableOpacity>
      <Text style={styles.title}>Suas Tarefas:</Text>
      {/* Lista de tarefas */}
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskDetails}>
              <Text>Nome: {item.name}</Text>
              <Text>Descrição: {item.description}</Text>
              <Text>Data: {new Date(item.date).toLocaleDateString()}</Text>
              <Text>Hora: {new Date(item.time).toLocaleTimeString()}</Text>
            </View>
            <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteButton}>
              <Icon name="delete" size={30} color="#FF6F6F" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Modal para o menu */}
      <Modal
        transparent={true}
        visible={drawerVisible}
        animationType="none" // Desativar animação do modal
        onRequestClose={() => setDrawerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnimation }] }]}>
              {/* Botão de fechar */}
              <Text style={styles.title2}>Menu:</Text>
              <Pressable onPress={() => setDrawerVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={30} color="#87CEEB"  />
              </Pressable>
            <View style={styles.Button}>
              <Button
                title="Adicionar tarefa"
                onPress={() => {
                  setDrawerVisible(false);
                  navigation.navigate('TaskForm', { username, addTask });
                }}
                color="#87CEEB"
              />
            </View>
            <View style={styles.exitButton}>
            <Button
                title="Sair da conta"
                onPress={() => {
                  setDrawerVisible(false);
                  navigation.navigate('Login');
                }}
                color="#87CEEB"
              />
            </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginTop: 35,
  },
  taskDetails: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 55,
    left: 0,
    width: 250,
    height: '94%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 16,
    zIndex: 2,
    justifyContent: 'space-between',
    transform: [{ translateX: -250 }], // Posição inicial fora da tela
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
    top: 55,
  },

  Button:{
    position: 'absolute',
    top: 46,
    left: 12,
    marginTop: 16,
    width: '100%',
  },
  
  exitButton:{
    position: 'absolute',
    bottom: 16, 
    left: 12,
    width: '100%',
  },

  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },

});

export default TaskList;
