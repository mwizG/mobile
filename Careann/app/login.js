import React, { useState, useContext } from 'react';
import { StatusBar, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../state/AuthContext'; // Import AuthContext
import { post } from '../services/api'; // Import the API service
import { styled } from 'nativewind'; // Import NativeWind



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
        navigation.navigate('dashboard/careseeker');
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
    
    <View className="flex-1 p-6 bg-gray-200 justify-center">
      <StatusBar barStyle="dark-content" />
      <Text className="text-4xl font-bold mb-8 text-center text-green-500">Login</Text>
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <View className="bg-indigo-600 rounded-lg">
        <Button
          className=""
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" className="mt-4" />}
    </View>
  );
};

export default Login;
