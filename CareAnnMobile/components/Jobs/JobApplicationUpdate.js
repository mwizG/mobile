import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function JobApplicationUpdate() {
  const route = useRoute();
  const { pk } = route.params; // Get the application ID from the route params
  const navigation = useNavigation();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setApplication(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching job application details', error);
      }
    };

    fetchApplication();
  }, [pk]);

  const handleStatusUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, { status }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      Alert.alert('Success', 'Job application status updated successfully!');
      navigation.navigate('CareSeekerApplications'); // Redirect after update
    } catch (error) {
      console.error('Error updating job application', error);
      Alert.alert('Error', 'There was an error updating the job application.');
    }
  };

  if (!application) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Job Application</Text>
      <Text><Text style={styles.label}>Job:</Text> {application.job}</Text>
      <Text><Text style={styles.label}>Caregiver:</Text> {application.caregiver}</Text>
      <Text><Text style={styles.label}>Cover Letter:</Text> {application.cover_letter}</Text>
      <Text><Text style={styles.label}>Applied At:</Text> {new Date(application.applied_at).toLocaleDateString()}</Text>
      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Accepted" value="Accepted" />
        <Picker.Item label="Rejected" value="Rejected" />
      </Picker>
      <Button title="Update Status" onPress={handleStatusUpdate} />

      {status === 'Accepted' && (
        <Button
          title="Propose Job Time"
          onPress={() => navigation.navigate('ProposeJobTime', { jobId: application.job })}
          style={styles.proposeButton}
        />
      )}
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
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  proposeButton: {
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobApplicationUpdate;
