import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { get, patch } from '../../services/api'; // Assuming you're using an API service
import { Picker } from '@react-native-picker/picker'; // Updated Picker import

const JobApplicationUpdate = () => {
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { applicationId } = route.params; // Get applicationId from route params
  const navigation = useNavigation();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }

        const response = await get(`/jobs/applications/${applicationId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed formatting
          },
        });
        
        setApplication(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching job application details', error);
        setError('Error fetching job application details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleStatusUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await patch(`/jobs/applications/${applicationId}/`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });
      navigation.navigate('JobApplicationList'); // Redirect after update
    } catch (error) {
      console.error('Error updating job application', error);
      Alert.alert('Error', 'Failed to update job application');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Job Application</Text>
      <Text style={styles.label}>Job ID: {application.job}</Text>
      <Text style={styles.label}>Caregiver: {application.caregiver}</Text>
      <Text style={styles.label}>Cover Letter: {application.cover_letter}</Text>
      <Text style={styles.label}>Applied At: {new Date(application.applied_at).toLocaleDateString()}</Text>

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Accepted" value="Accepted" />
        <Picker.Item label="Rejected" value="Rejected" />
      </Picker>

      <Button title="Update Status" onPress={handleStatusUpdate} />

      {/* Conditionally render the Propose Job Time button if the status is "Accepted" */}
      {status === 'Accepted' && (
        <Button
          title="Propose Job Time"
          onPress={() => navigation.navigate('ProposeJobTime', { jobId: application.job })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
});

export default JobApplicationUpdate;
