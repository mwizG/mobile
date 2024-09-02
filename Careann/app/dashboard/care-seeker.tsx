import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CareSeekerDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Care Seeker Dashboard</Text>
      <Text style={styles.welcomeMessage}>
        Welcome to your dashboard. From here, you can manage your care needs effectively.
      </Text>

      <View style={styles.dashboardOptions}>
        <Button title="Search for Caregivers" onPress={() => navigation.navigate('SearchCaregivers')} />
        <Button title="Post a Job" onPress={() => navigation.navigate('PostJob')} />
        <Button title="View & Manage Job Listings" onPress={() => navigation.navigate('ManageListings')} />
        <Button title="Messaging" onPress={() => navigation.navigate('Messaging')} />
        <Button title="Manage Payments" onPress={() => navigation.navigate('PaymentHistory')} />
        <Button title="Manage Reviews" onPress={() => navigation.navigate('ReviewList')} />
        <Button title="Manage Schedule" onPress={() => navigation.navigate('Scheduler')} />
        <Button title="Emergency Services" onPress={() => navigation.navigate('EmergencyServices')} />
        <Button title="Profile Management" onPress={() => navigation.navigate('Profile')} />
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>
      <View>
            {/* Other dashboard features */}
            <Button title="Messaging" onPress={() => navigation.navigate('ConversationList')} />
        </View>
      <View style={styles.notificationsSection}>
        <Text style={styles.notificationsTitle}>Notifications</Text>
        <View>
          {/* Example notifications, replace with actual data */}
          <Text style={styles.notificationItem}>You have 3 new messages from caregivers.</Text>
          <Text style={styles.notificationItem}>Your job posting "Elderly Care Needed" received 5 applications.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  welcomeMessage: {
    fontSize: 16,
    marginBottom: 16,
  },
  dashboardOptions: {
    marginBottom: 24,
  },
  notificationsSection: {
    marginTop: 24,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default CareSeekerDashboard;
