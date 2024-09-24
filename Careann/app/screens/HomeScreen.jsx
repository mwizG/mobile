import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const AppBar = ({ onNotificationPress }) => {
  return (
    <View className="flex-row px-4 py-1 justify-between items-center bg-white">
      <Text className="text-lg">Careseeker Dashboard</Text>
      <Pressable className="w-6 h-6 bg-gray-300" onPress={onNotificationPress}>
        <FontAwesome
          name="bell"
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  );
};

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 flex-row">
      <View className="flex-1">
        <AppBar onNotificationPress={() => setModalVisible(true)} />
        <ScrollView className="bg-gray-100">
        <View >
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
      </View>
      {/* Modal to show notifications */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View className="flex-1 justify-center items-center bg-gray-100/70">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Notifications</Text>
            {/* Notification list */}
            <Text>No new notifications</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
    </SafeAreaView>
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
