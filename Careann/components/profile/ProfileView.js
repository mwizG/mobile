import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileContext } from '../../state/ProfileContext';

const ProfileView = () => {
  const { profile } = useContext(ProfileContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{profile.username}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{profile.email}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{profile.location}</Text>
      <Text style={styles.label}>Bio:</Text>
      <Text style={styles.value}>{profile.bio}</Text>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ProfileView;
