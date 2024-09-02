import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostJob = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handlePostJob = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // Fetching the token from AsyncStorage
            if (!token) {
                Alert.alert('Error', 'User not authenticated');
                return;
            }

            await axios.post('http://127.0.0.1:8000/api/jobs/create/', {
                title,
                description,
                location,
                job_type: jobType,
                pay_rate: payRate,
                scheduled_time: scheduledTime,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            Alert.alert('Success', 'Job posted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error posting job', error);
            Alert.alert('Error', 'Something went wrong while posting the job.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Post a Job</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Job Type"
                value={jobType}
                onChangeText={setJobType}
            />
            <TextInput
                style={styles.input}
                placeholder="Pay Rate"
                value={payRate}
                onChangeText={setPayRate}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Scheduled Time"
                value={scheduledTime}
                onChangeText={setScheduledTime}
            />
            <Button title="Post Job" onPress={handlePostJob} />
        </View>
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
});

export default PostJob;
