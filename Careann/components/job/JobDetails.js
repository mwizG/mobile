import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { api } from '../../services/api'; // Assuming your api.js is set up properly
import { JobContext } from '../../state/JobContext'; // Import JobContext to manage state

function JobDetails() {
  const route = useRoute(); // Use this to get params in React Native
  const { jobId } = route.params; // Get jobId from the navigation params
  const [job, setJob] = useState(null);
  const { selectedJob, fetchJobById } = useContext(JobContext); // Use context to manage job state

  useEffect(() => {
    const fetchJob = async () => {
      try {
        await fetchJobById(jobId); // Fetch job details from context or API
        setJob(selectedJob); // Set job details from context
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJob();
  }, [jobId]);

  const acceptJobTime = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.patch(`/jobs/${jobId}/accept-time/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Job time accepted:', response.data);
      setJob(response.data); // Update job state with the accepted time
    } catch (error) {
      console.error('Error accepting job time', error);
    }
  };

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Description:</Text> {job.description}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Location:</Text> {job.location}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Pay Rate:</Text> ${job.pay_rate}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Status:</Text> {job.status}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Proposed Time:</Text> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}</Text>
      {job.proposed_time && (
        <Button title="Accept Proposed Time" onPress={acceptJobTime} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default JobDetails;
