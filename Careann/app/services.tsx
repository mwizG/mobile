import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Services = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Services</Text>
      <Text style={styles.description}>Explore the services we offer to care seekers and caregivers.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Services;
