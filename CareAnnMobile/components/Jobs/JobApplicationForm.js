import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function JobApplicationForm() {
  const route = useRoute();
  const { jobId } = route.params; // Get the job ID from the route parameters
  const [coverLetter, setCoverLetter] = useState('');
  const navigation = useNavigation(); // For navigating back after submission

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const requestData = {
        cover_letter: coverLetter,
      };
      const headers = {
        Authorization: `Token ${token}`,
      };

      // Log the request data and headers
      console.log('Request Data:', requestData);
      console.log('Headers:', headers);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/jobs/${jobId}/apply/`,
        requestData,
        { headers }
      );

      // Handle success, such as navigating back to the job list or dashboard
      Alert.alert('Success', 'Application submitted successfully!');
      navigation.navigate('CaregiverDashboard');
    } catch (error) {
      console.error('Error applying for the job:', error);
      Alert.alert('Error', 'There was an error applying for the job. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apply for Job</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write your cover letter here..."
        value={coverLetter}
        onChangeText={setCoverLetter}
        multiline
        numberOfLines={5}
      />
      <Button title="Submit Application" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textArea: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    textAlignVertical: 'top', // Ensures text starts from the top in Android
  },
});

export default JobApplicationForm;
