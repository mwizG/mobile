import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const JobSearchFilters = ({ onApplyFilters }) => {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [payRate, setPayRate] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ location, jobType, payRate });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      
      <Text style={styles.label}>Job Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter job type"
        value={jobType}
        onChangeText={setJobType}
      />

      <Text style={styles.label}>Pay Rate</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pay rate"
        value={payRate}
        onChangeText={setPayRate}
      />

      <Button title="Apply Filters" onPress={handleApplyFilters} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
});

export default JobSearchFilters;
