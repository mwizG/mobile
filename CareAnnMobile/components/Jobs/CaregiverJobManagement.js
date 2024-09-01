import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function CaregiverJobManagement() {
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/caregiver-jobs/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs', error);
            }
        };

        fetchJobs();
    }, []);

    const renderJob = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.location}</Text>
            <Text>{new Date(item.scheduled_time).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Assigned Jobs</Text>
            <FlatList
                data={jobs}
                renderItem={renderJob}
                keyExtractor={(item) => item.id.toString()}
            />
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
    jobTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
});

export default CaregiverJobManagement;
