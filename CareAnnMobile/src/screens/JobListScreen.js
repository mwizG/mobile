// In screens/JobListScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function JobListScreen({ route, navigation }) {
  const { token } = route.params;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobs/search/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs');
      }
    };

    fetchJobs();
  }, [token]);

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/jobs/${jobId}/apply/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert('Applied successfully');
    } catch (err) {
      setError('Failed to apply for the job');
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
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Apply" onPress={() => handleApply(item.id)} />
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
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
