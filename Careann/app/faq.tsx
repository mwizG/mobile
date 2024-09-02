import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FAQ = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <Text style={styles.description}>Find answers to common questions about CareAnn.</Text>
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

export default FAQ;
