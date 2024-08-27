// In screens/CaregiverScheduleScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { apiGet, apiPost } from '../utils/Api';

export default function CaregiverScheduleScreen({ route, navigation }) {
  const { token } = route.params;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await apiGet('/jobs/caregiver-jobs/');
        setJobs(result);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAccept = async (jobId) => {
    try {
      await apiPost(`/jobs/${jobId}/accept/`, { scheduled_time: new Date() });  // Replace with actual scheduled time
      alert('Job accepted');
      navigation.goBack();  // Refresh the screen
    } catch (err) {
      setError('Failed to accept job');
    }
  };

  const handleDecline = async (jobId) => {
    try {
      await apiPost(`/jobs/${jobId}/decline/`);
      alert('Job declined');
      navigation.goBack();  // Refresh the screen
    } catch (err) {
      setError('Failed to decline job');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Scheduled Time: {item.scheduled_time}</Text>
            <Button title="Accept" onPress={() => handleAccept(item.id)} />
            <Button title="Decline" onPress={() => handleDecline(item.id)} />
          </View>
        )}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  jobItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
