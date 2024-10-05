import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postJob } from '../../services/jobService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'; 
import 'nativewind';
import JobTimePicker from '../common/TimePicker';
import JobDatePicker from '../common/DatePicker';

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

const JobPostingForm = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [payRate, setPayRate] = useState('');
    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedJobType, setSelectedJobType] = useState('');
    const [locations, setLocations] = useState([]); 

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    console.error('User is not logged in. Please log in to continue.');
                    return;
                }
                const response = await axios.get('http://192.168.251.86:8000/api/jobs/locations/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations', error);
            }
        };
        fetchLocations();
    }, []);

    const valid = title && description && location && payRate && selectedJobType && scheduledDate && selectedTime;

    const handlePostJob = async () => {
        console.log('Posting job...');
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Error', 'User not authenticated');
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
            Alert.alert('Success', 'Job posted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error posting job', error);
            Alert.alert('Error', 'Something went wrong while posting the job.');
        }
    };

    return (
        <SafeAreaView className="flex-1 flex-row p-4">
            <View className="flex-1">
                <TextInput
                    className={`text-lg mb-2 p-4 rounded-lg ${title ? 'border-green-500' : 'border-gray-300'} border`}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    className={`text-lg mb-2 p-4 rounded-lg ${description ? 'border-green-500' : 'border-gray-300'} border`}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Location Picker */}
                <View className={`mb-2 ${location ? 'border-green-500' : 'border-gray-300'} border rounded-lg`}>
                    <Text className="text-lg mb-2">Select Location:</Text>
                    <Picker
                        selectedValue={location}
                        onValueChange={(itemValue) => setLocation(itemValue)}
                    >
                        {locations.length > 0 ? (
                            locations.map((loc) => (
                                <Picker.Item label={loc.name} value={loc.id} key={loc.id} />
                            ))
                        ) : (
                            <Picker.Item label="Loading locations..." value="" />
                        )}
                    </Picker>
                </View>

                {/* Job Type Dropdown */}
                <View className={`mb-2 ${selectedJobType ? 'border-green-500' : 'border-gray-300'} border rounded-lg`}>
                    <Text className="text-lg mb-2">Select Job Type:</Text>
                    <Picker
                        selectedValue={selectedJobType}
                        onValueChange={(itemValue) => setSelectedJobType(itemValue)}
                    >
                        <Picker.Item label="Select a job type" value="" />
                        {jobTypes.map((jobType, index) => (
                            <Picker.Item label={jobType} value={jobType} key={index} />
                        ))}
                    </Picker>
                </View>

                <View className={`rounded-lg flex flex-row items-center px-3 mb-4 ${payRate ? 'border-green-500' : 'border-gray-300'} border`}>
                    <Text className="text-lg text-gray-700">ZMW</Text>
                    <TextInput
                        className="flex-1 text-lg p-3 text-black"
                        keyboardType="numeric"
                        placeholder='Enter pay rate'
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
