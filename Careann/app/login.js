import React, { useState, useContext } from 'react';
import { StatusBar, View, Text, TextInput, Button, ActivityIndicator, Pressable } from 'react-native';
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
  const { role } = useContext(AuthContext);
  //console.log('User role:', role); // This should now log the correct role
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
        const response = await post('/accounts/login/', data);
        console.log('Login response:', response.data);

        // Extract user and role correctly
        const user = response.data.user;
        const role = response.data.role;  // Access role directly from the response

        // Store token and user info in AsyncStorage
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Update context
        setUser(user);
        console.log('User context updated:', user);
        console.log('User role:', role);  // Log the role for debugging

        // Navigate based on user role
        if (role === 'care_seeker') {
            navigation.navigate('dashboard/careseeker');
        } else if (user.is_caregiver) {
            navigation.navigate('dashboard/caregiver');
        } else if (user.is_admin) {
            navigation.navigate('dashboard/admin');
        } else {
            navigation.navigate('index'); // Fallback to home if role is not recognized
        }
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        setError('Invalid username or password. Please try again.');
    } finally {
        setLoading(false);
    }
};

  
  return (
    
    <View className="flex-1 p-6 bg-gray-200 justify-center">
      <StatusBar backgroundColor='white' barStyle="dark-content" />
      <Text className="text-4xl font-bold mb-8 text-center text-green-500">Login</Text>
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      <TextInput
        className={`text-lg mb-2 p-4 rounded-lg ${username ? 'border-green-500' : 'border-gray-300'} border`}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        className={`text-lg mb-2 p-4 rounded-lg ${password ? 'border-green-500' : 'border-gray-300'} border`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <Pressable
            className="bg-blue-500 p-1 rounded items-center mt-2"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? 
            <Text className="text-lg text-white">
            Logging in....
          </Text>
           : 
            <Text className="text-lg text-white">
              LOGIN
            </Text>}
            

      </Pressable>
      {loading && <ActivityIndicator size="large" color="#0000ff" className="mt-4" />}
    </View>
  );
};

export default Login;
