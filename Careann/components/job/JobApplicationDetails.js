import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { get } from '../../services/api'; // Using your API service

const JobApplicationDetail = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute(); // Get route params
  const { applicationId } = route.params; // Get the application ID passed from the previous screen
  const navigation = useNavigation(); // Use navigation to redirect after accepting/declining the job

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }

        // Fetch the job details using the applicationId
        const response = await get(`/jobs/applications/${applicationId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed formatting
          },
        });

        setJob(response.data); // Set the job data in state
      } catch (error) {
        console.error('Error fetching job details', error);
        setError('Error fetching job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [applicationId]);

  const handleAcceptJob = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await get(`/jobs/${applicationId}/accept/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });
      navigation.navigate('CaregiverJobs'); // Redirect to caregiver jobs page after accepting
    } catch (error) {
      console.error('Error accepting the job', error);
      Alert.alert('Error', 'Failed to accept the job');
    }
  };

  const handleDeclineJob = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await get(`/jobs/${applicationId}/decline/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });
      navigation.navigate('CaregiverJobs'); // Redirect to caregiver jobs page after declining
    } catch (error) {
      console.error('Error declining the job', error);
      Alert.alert('Error', 'Failed to decline the job');
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
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.boldText}>Description: <Text style={styles.normalText}>{job.description}</Text></Text>
      <Text style={styles.boldText}>Location: <Text style={styles.normalText}>{job.location}</Text></Text>
      <Text style={styles.boldText}>Pay Rate: <Text style={styles.normalText}>K{job.pay_rate}</Text></Text>
      <Text style={styles.boldText}>Status: <Text style={styles.normalText}>{job.status}</Text></Text>
      <Text style={styles.boldText}>Scheduled Time: <Text style={styles.normalText}>{new Date(job.scheduled_time).toLocaleString()}</Text></Text>

      <View>
        <Button title="Accept Job" onPress={handleAcceptJob} disabled={job.status !== 'Open'} />
        <Button title="Decline Job" onPress={handleDeclineJob} disabled={job.status !== 'Open'} />
      </View>
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
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 16,
  },
});

export default JobApplicationDetail;
