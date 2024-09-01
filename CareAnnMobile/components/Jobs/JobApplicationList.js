import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function JobApplicationList() {
  const [applications, setApplications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const applicationsWithJobTitles = await Promise.all(
          response.data.map(async (application) => {
            // Fetch job details for each application
            const jobResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/${application.job}/`, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
            return {
              ...application,
              jobTitle: jobResponse.data.title,
            };
          })
        );

        setApplications(applicationsWithJobTitles);
      } catch (error) {
        console.error('Error fetching job applications', error);
      }
    };

    fetchApplications();
  }, []);

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ApplicationDetails', { applicationId: item.id })}
      style={styles.applicationItem}
    >
      <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Applications</Text>
      <FlatList
        data={applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  applicationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#555',
  },
});

export default JobApplicationList;
