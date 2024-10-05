import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native'; // For navigation and route params
import { post } from '../../services/api'; // Assuming you're using a custom API service

const JobApplicationForm = () => {
  const [coverLetter, setCoverLetter] = useState('');
  const navigation = useNavigation();
  const route = useRoute(); // Get jobId from the route params
  const { jobId } = route.params;

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get the token from AsyncStorage
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const requestData = {
        cover_letter: coverLetter,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Log the request data and headers
      console.log('Request Data:', requestData);
      console.log('Headers:', headers);
      console.log('Job ID:', jobId);

      // Send the POST request to apply for the job
      const response = await post(`/jobs/${jobId}/apply/`, requestData, {
        headers: headers,
      });

      // Handle success and navigate back to the dashboard or success page
      Alert.alert('Success', 'Job application submitted successfully', [
        { text: 'OK', onPress: () => navigation.navigate('CaregiverDashboard') },
      ]);
    } catch (error) {
      console.error('Error applying for the job:', error);
      Alert.alert('Error', 'Failed to apply for the job');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        placeholder="Write your cover letter here..."
        value={coverLetter}
        onChangeText={setCoverLetter}
        multiline={true}
        numberOfLines={5}
      />
      <Button title="Submit Application" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textArea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    textAlignVertical: 'top',
  },
});

export default JobApplicationForm;
