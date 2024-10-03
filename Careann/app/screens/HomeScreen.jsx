import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBar from "../../components/common/AppBar";
import JobListCard from "../../components/common/JobListCard";



const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const jobData = {
    title: "I need help",
    description: "This is a test description to see how the content is being rendered, to allow me to style this properly.",
    location: "lsk",
    job_type: "Respite Care",
    pay_rate: 20.00,
    scheduled_time: "2024-10-20 19:00", // Convert to ISO string
  };



  return (
    <SafeAreaView className="flex-1 flex-row">
      <StatusBar backgroundColor='white' barStyle="dark-content" />
      <View className="flex-1">
        <AppBar onNotificationPress={() => setModalVisible(true)} />

        <ScrollView className="bg-gray-100">
          <View className="flex-1">
            <View className="flex items-center">
              <JobListCard jobDetail={jobData} onCardClick={()=> {console.log('card press')}} />
            </View>
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
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Notifications</Text>
            {/* Notification list */}
            <Text className="mb-2">No new notifications</Text>
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
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  notificationItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default HomeScreen;
