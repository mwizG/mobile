import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const data = { username, password };
      const response = await axios.post(`${BASE_URL}/accounts/login/`, data);

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('role', response.data.role);

      if (response.data.role === 'care_seeker') {
        navigation.navigate('CareSeekerDashboard');
      } else if (response.data.role === 'caregiver') {
        navigation.navigate('CaregiverDashboard');
      } else if (response.data.role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('Home'); // Fallback to home if role is not recognized
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        disabled={loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        disabled={loading}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleSubmit} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default Login;
