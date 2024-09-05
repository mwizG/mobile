import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { JobContext } from '../../state/JobContext';
import { useNavigation } from '@react-navigation/native';

const JobListingManager = () => {
  const { jobs, fetchJobs, deleteJob } = useContext(JobContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (jobId) => {
    deleteJob(jobId);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.location}</Text>

            {/* View Job Details */}
            <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
              <Text style={styles.linkText}>View Details</Text>
            </TouchableOpacity>

            {/* View Applications */}
            <TouchableOpacity onPress={() => navigation.navigate('JobApplicationList', { jobId: item.id })}>
              <Text style={styles.linkText}>View Applications</Text>
            </TouchableOpacity>

            {/* Delete Job */}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.linkText}>Delete Job</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Post a Job" onPress={() => navigation.navigate('PostJob')} />
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
  linkText: {
    color: 'blue',
    marginTop: 5,
  },
});

export default JobListingManager;
