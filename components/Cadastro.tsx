import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const Cadastro = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCadastro = async () => {
    try {
      const apiUrl = 'http://10.0.2.2:3001/users'; // Atualize aqui

      // Verificar se o nome de usuário já existe
      const response = await axios.get(apiUrl);
      const users = response.data;
      const existingUser = users.find((user: any) => user.username === username);

      if (existingUser) {
        Alert.alert('Erro', 'Nome de usuário já cadastrado');
        return;
      }

      // Criptografar a senha
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

      // Cadastrar o novo usuário
      await axios.post(apiUrl, {
        username,
        password: hashedPassword,
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
});

export default Cadastro;
