import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchJobs } from '../../services/jobService';
import { useNavigation } from '@react-navigation/native';
import { JobContext } from '../../state/JobContext';

const JobList = ({ filters }) => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  const { setJobDetails } = useContext(JobContext); // Access the JobContext

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs(filters);
      setJobs(data);
    };

    loadJobs();
  }, [filters]);

  const handleJobPress = (job) => {
    setJobDetails(job); // Store job details in context
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJobPress(item)}>
            <View style={styles.jobItem}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text>{item.location}</Text>
              <Text>{item.pay_rate}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  jobItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobTitle: {
    fontWeight: 'bold',
  },
});

export default JobList;
