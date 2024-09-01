import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function JobApplicationDetail() {
    const route = useRoute();
    const { id } = route.params; // Get the application ID from the route params
    const navigation = useNavigation();
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details', error);
            }
        };

        fetchJob();
    }, [id]);

    const handleAcceptJob = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            Alert.alert('Success', 'Job accepted successfully!');
            navigation.navigate('CaregiverJobs'); // Redirect to the caregiver jobs page after accepting
        } catch (error) {
            console.error('Error accepting the job', error);
            Alert.alert('Error', 'There was an error accepting the job. Please try again.');
        }
    };

    const handleDeclineJob = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/decline/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            Alert.alert('Success', 'Job declined successfully!');
            navigation.navigate('CaregiverJobs'); // Redirect to the caregiver jobs page after declining
        } catch (error) {
            console.error('Error declining the job', error);
            Alert.alert('Error', 'There was an error declining the job. Please try again.');
        }
    };

    if (!job) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{job.title}</Text>
            <Text><Text style={styles.label}>Description:</Text> {job.description}</Text>
            <Text><Text style={styles.label}>Location:</Text> {job.location}</Text>
            <Text><Text style={styles.label}>Pay Rate:</Text> ${job.pay_rate}</Text>
            <Text><Text style={styles.label}>Status:</Text> {job.status}</Text>
            <Text><Text style={styles.label}>Scheduled Time:</Text> {job.scheduled_time ? new Date(job.scheduled_time).toLocaleString() : 'N/A'}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Accept Job" onPress={handleAcceptJob} disabled={job.status !== 'Open'} />
                <Button title="Decline Job" onPress={handleDeclineJob} disabled={job.status !== 'Open'} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default JobApplicationDetail;
