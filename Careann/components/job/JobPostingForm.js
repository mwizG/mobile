import React, { useState, useEffect } from "react";
import { Platform,View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJob } from "../../services/jobService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import "nativewind";
import JobTimePicker from "../common/TimePicker";
import JobDatePicker from "../common/DatePicker";
import DropDownPicker from 'react-native-dropdown-picker';
import LocationPicker from '../common/LocationPicker';

const jobTypes = [
  "Respite Care",
  "Home Care",
  "Senior Care",
  "Child Care",
  "Disability Care",
  "Palliative Care",
  "Post-Surgical Care",
  "Maternity Care",
  "Dementia Care",
];

const JobPostingForm = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [payRate, setPayRate] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedJobType, setSelectedJobType] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    description:'',
    location: null,
    pay_rate: '',
    selectedJobType: '',
    scheduledDate:'',
    scheduledTime:''
  });

  const handleLocationChange = (selectedLocation) => {
    setFormData({ ...formData, location: selectedLocation });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const valid =
    title &&
    description &&
    location &&
    payRate &&
    selectedJobType &&
    scheduledDate &&
    selectedTime;

  const handlePostJob = async () => {
    console.log("Posting job...");
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const scheduledDateTime = new Date(
        scheduledDate.getFullYear(),
        scheduledDate.getMonth(),
        scheduledDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      const jobData = {
        title,
        description,
        location,
        job_type: selectedJobType,
        pay_rate: payRate,
        scheduled_time: scheduledDateTime.toISOString(),
      };

      await postJob(jobData, token);
      Alert.alert("Success", "Job posted successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error posting job", error);
      Alert.alert("Error", "Something went wrong while posting the job.");
    }
  };

  return (
    <SafeAreaView className="flex-1 flex-row p-4">
      <ScrollView className="flex-1">
        <TextInput
          className={`text-lg mb-2 p-4 rounded-lg ${title ? "border-green-500" : "border-gray-300"} border`}
          placeholder="Title"
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
        />
        <TextInput
          className={`text-lg mb-2 p-4 rounded-lg ${description ? "border-green-500" : "border-gray-300"} border`}
          placeholder="Description"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
        />

        {/* Location Picker */}
        <View className="flex">
            <LocationPicker
                location={formData.location}
                setLocation={handleLocationChange}
            />
        </View>

        {/* Job Type Dropdown 
        <View
          className={`mb-2 ${selectedJobType ? "border-green-500" : "border-gray-300"} border rounded-lg`}
        >
          <Text className="text-lg mb-2">Select Job Type:</Text>
          <Picker
            selectedValue={formData.selectedJobType}
            onValueChange={(value) => handleChange('selectedJobType', value)}
          >
            <Picker.Item label="Select a job type" value="" />
            {jobTypes.map((jobType, index) => (
              <Picker.Item label={jobType} value={jobType} key={index} />
            ))}
          </Picker>
        </View>
        */}

        <View
          className={`rounded-lg flex flex-row items-center px-3 mb-4 ${payRate ? "border-green-500" : "border-gray-300"} border`}
        >
          <Text className="text-lg text-gray-700">ZMW</Text>
          <TextInput
            className="flex-1 text-lg p-3 text-black"
            keyboardType="numeric"
            placeholder="Enter pay rate"
            value={payRate}
            onChangeText={setPayRate}
          />
        </View>

        <View>
          <View className="flex-row justify-evenly items-center">
            <Text className="text-lg">Select Proposed Date:</Text>
            <JobDatePicker onDateChange={setScheduledDate} />
          </View>

          <View className="flex-row justify-evenly items-center">
            <Text className="text-lg">Select Proposed Time:</Text>
            <JobTimePicker onTimeChange={setSelectedTime} />
          </View>
        </View>

        <Pressable
          className={`mt-auto mb-auto p-4 rounded-lg items-center ${valid ? "bg-green-500" : "bg-gray-300"}`}
          onPress={handlePostJob}
          disabled={!valid}
        >
          <Text className="text-lg text-white">Post Job</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobPostingForm;
