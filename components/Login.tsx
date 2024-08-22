import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ImageBackground } from 'react-native';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const Login = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Verifica se o nome de usuário e a senha foram preenchidos
      if (!username || !password) {
        Alert.alert('Erro', 'Usuário e senha são obrigatórios');
        return;
      }

      // Criptografar a senha
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

      // Substitua pela URL do seu endpoint de autenticação
      const apiUrl = 'http://10.0.2.2:3001/users';

      // Envia a requisição de autenticação
      const response = await axios.get(apiUrl);
      const users = response.data;
      const user = users.find((user: any) => user.username === username && user.password === hashedPassword);

      if (user) {
        navigation.navigate('TaskList', { username });
      } else {
        Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao realizar o login:', error);
      Alert.alert('Erro', 'Não foi possível realizar o login');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://your-image-url.com/background.jpg' }} // URL da imagem de fundo
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-Vindo</Text>
        <Text style={styles.title2}>A seu organizador de tarefas</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#007bff" />
        </View>
        <Button
          title="Cadastre-se"
          onPress={() => navigation.navigate('Cadastro')}
          color="#007bff"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta a imagem para cobrir a tela
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo branco semi-transparente
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  title2: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 20, // Adiciona espaçamento superior
  },
});

export default Login;
