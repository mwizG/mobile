import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Modal,SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const AppBar = ({ onNotificationPress }) => {
  return (
    <SafeAreaView>
    <View className="flex-row justify-between items-center bg-blue-600 p-4">
      <Text className="text-white text-lg">Careseeker Dashboard</Text>
      <FontAwesome
        name="bell"
        size={24}
        color="white"
        onPress={onNotificationPress}
      />
    </View>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View className="flex-1">
      <AppBar onNotificationPress={() => setModalVisible(true)} />
      
      <ScrollView style={styles.container}>
      <View style={styles.dashboardOptions}>
        <Button title="Search for Caregivers" onPress={() => navigation.navigate('SearchCaregivers')} />
        <Button title="Post a Job" onPress={() => navigation.navigate('JobPostingForm')} />
        <Button title="View & Manage Job Listings" onPress={() => navigation.navigate('JobListingManager')} />
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
      </ScrollView>
      {/* Modal to show notifications */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Notifications</Text>
            {/* Notification list */}
            <Text>No new notifications</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
    </View>
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

export default HomeScreen;
