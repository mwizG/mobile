import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProposeJobTime() {
  const route = useRoute();
  const { id } = route.params; // Get the job ID from the route params
  const navigation = useNavigation();
  const [proposedTime, setProposedTime] = useState('');

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // Log the token and request details
      console.log('Token:', token);
      console.log('Job ID:', id);
      console.log('Proposed Time:', proposedTime);

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/jobs/${id}/propose-time/`,
        { proposed_time: proposedTime },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Proposed job time successfully!');
      navigation.navigate('JobDetail', { jobId: id }); // Redirect to job details after proposing time
    } catch (error) {
      console.error('Error proposing job time', error);
      Alert.alert('Error', 'There was an error proposing the job time. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Propose Job Time</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:MM"
        value={proposedTime}
        onChangeText={setProposedTime}
        keyboardType="default"
        required
      />
      <Button title="Propose Time" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ProposeJobTime;
