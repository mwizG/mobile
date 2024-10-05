import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import navigation
import { JobContext } from '../../state/JobContext'; // Import JobContext to manage state
import { RoleContext } from '../../state/RoleContext'; // Assuming you have a RoleContext for managing roles
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api'; // Assuming your api.js is set up properly

function JobDetails() {
  const route = useRoute(); // Use this to get params in React Native
  const navigation = useNavigation(); // Use navigation to navigate to JobApplicationForm
  const { jobId } = route.params; // Get jobId from the navigation params
  const [job, setJob] = useState(null);
  const { selectedJob, fetchJobById } = useContext(JobContext); // Use context to manage job state
  const { role: userRole } = useContext(RoleContext); // Fetch role from RoleContext
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        await fetchJobById(jobId); // Fetch job details from context or API
        setJob(selectedJob); // Set job details from context
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJob(); // Fetch job details when the component is mounted
  }, [jobId]);

  const acceptJobTime = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.patch(`/jobs/${jobId}/accept-time/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });
      console.log('Job time accepted:', response.data);
      setJob(response.data); // Update job state with the accepted time
    } catch (error) {
      console.error('Error accepting job time', error);
    }
  };

  const handleApply = () => {
    // Navigate to JobApplicationForm and pass jobId as a param
    navigation.navigate('JobApplicationForm', { jobId });
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
      <Text style={styles.detailText}><Text style={styles.boldText}>Pay Rate:</Text> K{job.pay_rate}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Status:</Text> {job.status}</Text>
      <Text style={styles.detailText}><Text style={styles.boldText}>Proposed Time:</Text> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}</Text>
      
      {job.proposed_time && (
        <Button title="Accept Proposed Time" onPress={acceptJobTime} />
      )}
      
      {/* Conditionally render Apply Button */}
      {userRole !== 'care_seeker' && userRole !== 'admin' && (
        <Button title="Apply for Job" onPress={handleApply} />
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
