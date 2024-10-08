import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import JobListCard from "@/components/common/JobListCard";

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

const CGHomeScreen = ({ fetchAll = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found.");
        }

        const endpoint = fetchAll
          ? "http://127.0.0.1:8000/api/jobs/all-jobs/" // Fetch all jobs
          : "http://127.0.0.1:8000/api/jobs/open-jobs/";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data);
      } catch (err) {
        const errorMessage = err.response
          ? `Error fetching jobs: ${err.response.data.detail || err.message}`
          : `Error fetching jobs: ${err.message}`;
        setError(errorMessage);
      } finally {
        setLoading(false); // Ensure loading is set to false regardless of the outcome
      }
    };

    fetchJobs();
  }, [fetchAll]); // Added fetchAll as a dependency if it can change

  return (
    <SafeAreaView className="flex-1 flex-row">
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View className="flex-1">
        <AppBar onNotificationPress={() => setModalVisible(true)} />

        <ScrollView className="bg-gray-50 p-4">
          <View className="flex-1">
            <View className="flex items-center">
              <View className="flex-row w-full justify-between mt-4">
                <Pressable
                  className="bg-blue-500 p-2 rounded"
                  onPress={() => navigation.navigate("Services")}
                >
                  <Text className="text-white font-semibold">Services</Text>
                </Pressable>
                <Pressable
                  className="bg-blue-500 p-2 rounded"
                  onPress={() => navigation.navigate("HowItWorks")}
                >
                  <Text className="text-white font-semibold">How it Works</Text>
                </Pressable>
                <Pressable
                  className="bg-blue-500 p-2 rounded"
                  onPress={() => navigation.navigate("Contact")}
                >
                  <Text className="text-white font-semibold">Contact</Text>
                </Pressable>
                <Pressable
                  className="bg-blue-500 p-2 rounded"
                  onPress={() => navigation.navigate("FAQ")}
                >
                  <Text className="text-white font-semibold">FAQ</Text>
                </Pressable>
              </View>
            </View>
            <View>
              <ScrollView className="flex-1 p-4">
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
              </ScrollView>
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

export default CGHomeScreen;
