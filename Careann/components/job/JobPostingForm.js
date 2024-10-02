import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postJob } from '../../services/jobService'; // Assuming postJob is imported correctly
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import 'nativewind';

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
  
        <View className="border border-gray-300 rounded-lg">
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
    const [scheduledTime, setScheduledTime] = useState(new Date()); // For time selection
    const [showDatePicker, setShowDatePicker] = useState(false); // To show/hide date picker
    const [showTimePicker, setShowTimePicker] = useState(false); // To show/hide time picker
    
    const [selectedJobType, setSelectedJobType] = useState('');

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
                scheduledTime.getHours(),
                scheduledTime.getMinutes()
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

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false); // Hide date picker after selection
        if (selectedDate) {
            setScheduledDate(selectedDate); // Set the selected date
        }
    };

    const onChangeTime = (event, selectedTime) => {
        setShowTimePicker(false); // Hide time picker after selection
        if (selectedTime) {
            setScheduledTime(selectedTime); // Set the selected time
        }
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
                className="text-lg mb-2 p-4 border border-gray-300 rounded-lg"
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                className="text-lg mb-2 p-4 border border-gray-300 rounded-lg"
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                className="text-lg mb-2 p-4 border border-gray-300 rounded-lg"
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <JobTypeDropdown selectedJobType={selectedJobType} setSelectedJobType={setSelectedJobType} />
            
            <View className="border border-gray-300 rounded-lg flex flex-row items-center px-3 mb-2">
                <Text className="text-lg text-gray-700">ZMW</Text>
                <TextInput
                className="flex-1 text-lg p-3 text-black"
                keyboardType="numeric"
                placeholder='Enter pay rate'
                value={payRate}
                onChangeText={onChangePay}
                />
            </View>
            
            <View style={styles.datePickerContainer}>
                <Button title="Select Proposed Date" onPress={() => setShowDatePicker(true)} />
                {showDatePicker && (
                    <DateTimePicker
                        value={scheduledDate}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                <Text style={styles.dateText}>
                    Scheduled Date: {scheduledDate.toLocaleDateString()}
                </Text>

                <Button title="Select Proposed Time" onPress={() => setShowTimePicker(true)} />
                {showTimePicker && (
                    <DateTimePicker
                        value={scheduledTime}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}
                <Text style={styles.dateText}>
                    Scheduled Time: {scheduledTime.toLocaleTimeString()}
                </Text>
            </View>

            <Button title="Post Job" onPress={handlePostJob} />
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    datePickerContainer: {
        marginBottom: 16,
    },
    dateText: {
        marginTop: 8,
        fontSize: 16,
    },
});

export default JobPostingForm;
