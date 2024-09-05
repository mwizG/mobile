import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { get } from '../../services/api'; // Using your API service

const JobApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Use navigation to navigate to the details screen

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }

        // Call the correct API endpoint for job applications
        const response = await get(`/jobs/applications/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching job applications:', error);
        setError('Error fetching job applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (applicationId) => {
    // Navigate to the JobApplicationDetail screen and pass the applicationId
    navigation.navigate('JobApplicationDetail', { applicationId });
  };
   
  if (loading) {
    return <Text>Loading applications...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
            <View style={styles.applicationItem}>
              <Text style={styles.jobTitle}>Job ID: {item.job}</Text>
              <Text style={styles.jobTitle}>Applicant: {item.caregiver}</Text>
              <Text>Status: {item.status}</Text>
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
  applicationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default JobApplicationList;
