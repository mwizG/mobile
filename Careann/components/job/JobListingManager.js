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
    <View className="flex-1 p-4">
      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-gray-300">
              <Text className="font-bold">{item.title}</Text>
              <Text>{item.location}</Text>

              {/* View Job Details */}
              <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                <Text className="text-blue-500 mt-2">View Details</Text>
              </TouchableOpacity>

              {/* View Applications */}
              <TouchableOpacity onPress={() => navigation.navigate('JobApplicationList', { jobId: item.id })}>
                <Text className="text-blue-500 mt-2">View Applications</Text>
              </TouchableOpacity>

              {/* Delete Job */}
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text className="text-blue-500 mt-2">Delete Job</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text className="text-center text-lg text-gray-500 mb-2 mt-2">
          You have not posted any Jobs
        </Text>
      )}

      <Button title="Post a Job" onPress={() => navigation.navigate('JobPostingForm')} />
    </View>
  );
};

export default JobListingManager;
