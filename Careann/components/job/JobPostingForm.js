import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postJob } from '../../services/jobService'; // Assuming postJob is imported correctly
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import 'nativewind';
import JobTimePicker from '../common/TimePicker';
import JobDatePicker from '../common/DatePicker';
import { styled } from 'nativewind';


const jobTypes = [
    'Respite Care',
    'Home Care',
    'Senior Care',
    'Child Care',
    'Disability Care',
    'Palliative Care',
    'Post-Surgical Care',
    'Maternity Care',
    'Dementia Care',
  ];

const JobTypeDropdown = ({ selectedJobType, setSelectedJobType }) => {

    return (
      <View className="mb-2">
        <Text className="text-lg mb-2">Select Job Type:</Text>
  
        <View className={`text-lg rounded-lg ${
                    selectedJobType ? 'border-green-500' : 'border-gray-300'
                  } border`}>
          <Picker
            placeholder='Select Job Type'
            selectedValue={selectedJobType}
            onValueChange={(itemValue) => setSelectedJobType(itemValue)}
            className=""
          >
            {jobTypes.map((job, index) => (
              <Picker.Item label={job} value={job} key={index} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

const JobPostingForm = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [payRate, setPayRate] = useState('');
    const [scheduledDate, setScheduledDate] = useState(new Date()); // Default to current date/time
    const [selectedTime, setselectedTime] = useState(new Date()); // For time selection
    const [showDatePicker, setShowDatePicker] = useState(false); // To show/hide date picker
    const [showTimePicker, setShowTimePicker] = useState(false); // To show/hide time picker
    
    const [selectedJobType, setSelectedJobType] = useState('');

    const valid = title && description && location && payRate && selectedJobType && scheduledDate && selectedTime;

    const handlePostJob = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'User not authenticated');
                return;
            }

            // Combine date and time into a single DateTime object
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
                scheduled_time: scheduledDateTime.toISOString(), // Convert to ISO string
            };

            await postJob(jobData, token);

            Alert.alert('Success', 'Job posted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error posting job', error);
            Alert.alert('Error', 'Something went wrong while posting the job.');
        }
    };

    

    const handleDateChange = (time) => {
        setScheduledDate(time);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    const onChangePay = (input) => {
        // Remove any non-numeric characters except for a decimal point
        const formattedInput = input.replace(/[^0-9.]/g, '');
    
        // Set formatted value
        setPayRate(formattedInput);
      };

    return (
        <SafeAreaView className="flex-1 flex-row p-4">
        <View className="flex-1">
            <TextInput
                className={`text-lg mb-2 p-4 rounded-lg ${
                    title ? 'border-green-500' : 'border-gray-300'
                } border`}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                className={`text-lg mb-2 p-4 rounded-lg ${
                    description ? 'border-green-500' : 'border-gray-300'
                  } border`}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                className={`text-lg mb-2 p-4 rounded-lg ${
                    location ? 'border-green-500' : 'border-gray-300'
                  } border`}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <JobTypeDropdown selectedJobType={selectedJobType} setSelectedJobType={setSelectedJobType} />
            
            <View className={`rounded-lg flex flex-row items-center px-3 mb-4 ${
                    payRate ? 'border-green-500' : 'border-gray-300'
                  } border`}
                  >
                <Text className="text-lg text-gray-700">ZMW</Text>
                <TextInput
                className="flex-1 text-lg p-3 text-black"
                keyboardType="numeric"
                placeholder='Enter pay rate'
                value={payRate}
                onChangeText={onChangePay}
                />
            </View>
            
            <View >
                <View className="flex-row justify-evenly items-center">
                    <Text className="text-lg">Select Proposed Date: </Text>
                    <JobDatePicker onTimeChange={handleDateChange} />
                </View>

                <View className="flex-row justify-evenly items-center">
                    <Text className="text-lg">Select Proposed Time: </Text>
                    <JobTimePicker onTimeChange={handleTimeChange} />
                </View>

            </View>

            <Pressable 
                className={`mt-auto mb-auto p-4 rounded-lg items-center ${valid ? 'bg-green-500' : 'bg-gray-300'}`}
                onPress={handlePostJob}
                disabled={!valid}
                >
            <Text className="text-lg text-white">Post Job</Text>
            </Pressable>
        </View>
        </SafeAreaView>
    );
};



export default JobPostingForm;
