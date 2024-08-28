// In screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function ProfileScreen({ route, navigation }) {
  const { token } = route.params;
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        'http://127.0.0.1:8000/api/accounts/profile/',
        profile,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(response.data);
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={profile.location}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
      />
      {/* Add more fields as needed */}
      <Button title="Update Profile" onPress={handleUpdate} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
