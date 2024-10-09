import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { searchJobs, getAllJobs } from '../../services/jobService'; // Import both job listing functions
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobContext } from '@/state/JobContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SearchJob = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedJob } = useContext(JobContext);
  const navigation = useNavigation(); // Initialize navigation

  // Fetch all jobs by default on component mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken'); // Ensure you replace this with real token management
        if (!token) {
          throw new Error('Token not found');
        }
        const data = await getAllJobs(token);
        setResults(data);
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong while fetching jobs.');
      }
    };
  
    fetchAllJobs();
  }, []);

  const handleJobPress = (job) => {
    setSelectedJob(job); // Store selected job details in context
    navigation.navigate('JobDetails', { jobId: job.id }); // Navigate to JobDetails
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token management logic
      if (query.trim() === '') {
        // If search query is empty, show all jobs
        const allJobs = await getAllJobs(token);
        setResults(allJobs);
      } else {
        const data = await searchJobs(query, token);
        setResults(data);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Jobs</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by title, location, job type..."
        value={query}
        onChangeText={(value) => setQuery(value)}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <Text>Loading...</Text>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
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
        />
      ) : (
        <Text>No jobs found.</Text> // Display this if no jobs are found
      )}
    </View>
  );
};

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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  jobItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  jobTitle: {
    fontWeight: 'bold',
  },
});

export default SearchJob;
