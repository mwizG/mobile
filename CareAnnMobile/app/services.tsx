// app/Services.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Services() {
  return (
    <View style={styles.container}>
      <Text>Our Services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
