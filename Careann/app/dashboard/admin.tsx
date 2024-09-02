import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      <Button title="Manage Users" onPress={() => navigation.navigate('UserManagement')} />
      <Button title="Content Moderation" onPress={() => navigation.navigate('ContentModeration')} />
      <Button title="Payment Oversight" onPress={() => navigation.navigate('PaymentOversight')} />
      <Button title="Analytics & Reporting" onPress={() => navigation.navigate('Analytics')} />
    </View>
  );
};

AdminDashboard.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AdminDashboard;
