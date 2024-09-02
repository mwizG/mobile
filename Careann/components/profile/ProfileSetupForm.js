
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ProfileContext } from '../../state/ProfileContext';

const ProfileSetupForm = () => {
  const { saveProfile } = useContext(ProfileContext);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    location: '',
    bio: '',
  });

  const handleChange = (name, value) => {
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = () => {
    saveProfile(profileData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={profileData.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={profileData.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={profileData.location}
        onChangeText={(value) => handleChange('location', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={profileData.bio}
        onChangeText={(value) => handleChange('bio', value)}
      />
      <Button title="Save Profile" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProfileSetupForm;
