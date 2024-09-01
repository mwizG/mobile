import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function CareSeekerDashboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Care Seeker Dashboard</Text>
      <Text>Welcome to your dashboard. From here, you can manage your care needs effectively.</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchCaregivers')}>
          <Text style={styles.buttonText}>Search for Caregivers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostJob')}>
          <Text style={styles.buttonText}>Post a Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageListings')}>
          <Text style={styles.buttonText}>View & Manage Job Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messaging')}>
          <Text style={styles.buttonText}>Messaging</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManagePayments')}>
          <Text style={styles.buttonText}>Manage Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageReviews')}>
          <Text style={styles.buttonText}>Manage Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageSchedule')}>
          <Text style={styles.buttonText}>Manage Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmergencyServices')}>
          <Text style={styles.buttonText}>Emergency Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfileManagement')}>
          <Text style={styles.buttonText}>Profile Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View>
          {/* Example notifications, replace with actual data */}
          <Text>You have 3 new messages from caregivers.</Text>
          <Text>Your job posting "Elderly Care Needed" received 5 applications.</Text>
        </View>
      </View>
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
  optionsContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  notificationsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CareSeekerDashboard;
