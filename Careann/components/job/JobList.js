import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { JobContext } from '../../state/JobContext';
import api from '../../services/api'; // Ensure that api.js is correctly imported

const JobList = ({ filters }) => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  const { setSelectedJob } = useContext(JobContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/search/', { params: filters });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleJobPress = (job) => {
    setSelectedJob(job);
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJobPress(item)} style={styles.jobItem}>
            <View>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobText}>
                <Text style={styles.boldText}>Description: </Text> {item.description}
              </Text>
              <Text style={styles.jobText}>
                <Text style={styles.boldText}>Location: </Text> {item.location}
              </Text>
              <Text style={styles.jobText}>
                <Text style={styles.boldText}>Pay Rate: </Text> K{item.pay_rate}
              </Text>
              <Text style={styles.jobText}>
                <Text style={styles.boldText}>Status: </Text> {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No jobs available at the moment.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  jobItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobText: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default JobList;
