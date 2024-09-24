import React, { useState, useContext } from 'react';
import { StatusBar, View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../state/AuthContext'; // Import AuthContext
import { post } from '../services/api';  // Import the API service

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const { setUser } = useContext(AuthContext); // Access the setUser function from AuthContext

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('Username and password are required.');
        setLoading(false);
        return;
      }

      const data = { username, password };
      const response = await post('/accounts/login/', data); // Use the API service
      console.log(response.data);

      // Store token and user info in AsyncStorage or Context
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('role', response.data.role);

      // Update context
      setUser(response.data.user);

      // Navigate based on user role
      if (response.data.role === 'care_seeker') {
        navigation.navigate('dashboard/new_care-seeker');
      } else if (response.data.role === 'caregiver') {
        navigation.navigate('dashboard/caregiver');
      } else if (response.data.role === 'admin') {
        navigation.navigate('dashboard/admin');
      } else {
        navigation.navigate('index'); // Fallback to home if role is not recognized
      }
    } catch (error) {
      console.error('Login failed', error.response?.data || error.message);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
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
