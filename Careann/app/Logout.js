import React, { useContext } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../state/AuthContext';
import { RoleContext } from '../state/RoleContext';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const { setUser } = useContext(AuthContext);
  const { setRole } = useContext(RoleContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('accessToken', response.data.access);
      await AsyncStorage.setItem('refreshToken', response.data.refresh);
      await AsyncStorage.removeItem('role');
      setUser(null);
      setRole(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logout;
