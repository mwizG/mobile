import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import JobListCard from "@/components/common/JobListCard";
import { fetchJobs } from "@/services/jobService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppBar = ({ onNotificationPress, onProfilePress }) => {
  return (
    <View className="flex-row px-4 py-1 justify-between items-center bg-white">
      <Text className="text-lg ">Careann</Text>
      <View className="flex-row p-2 gap-4">
        <Pressable onPress={onNotificationPress}>
          <FontAwesome name="bell" size={24} color="black" />
        </Pressable>
        <Pressable onPress={onProfilePress}>
          <FontAwesome name="user" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

const CGHomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const [fetchAll,setFetchAll] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken'); // Ensure you replace this with real token management
        if (!token) {
          throw new Error('Token not found');
        }
        const data = await fetchJobs(token);
        setJobs(data);
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong while fetching jobs.');
      }
    };
  
    getJobs();
  }, [fetchAll]);

  return (
    <SafeAreaView className="flex-1 flex-row ">
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View className="flex-1 bg-blue-200">
        <AppBar onNotificationPress={() => setModalVisible(true)} />
        <ScrollView className=" p-4">
          
          <View className="flex-1">
                {jobs ? (
                  jobs.map((job) => (
                    <JobListCard
                      jobDetail={job}
                      onCardClick={() => {
                        console.log("card press");
                      }}
                    />
                  ))
                ) : (
                  <Text className="">No jobs are currently open.</Text>
                )}
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

export default CGHomeScreen;
