import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CaregiverJobSearch() {
    const [location, setLocation] = useState('');
    const [careType, setCareType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [jobs, setJobs] = useState([]);
    const navigation = useNavigation();

    const fetchJobs = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/jobs/search', {
                headers: {
                    Authorization: `Token ${token}`,
                },
                params: {
                    location,
                    care_type: careType,
                    pay_rate: payRate,
                },
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
        }
    }, [location, careType, payRate]);

    useEffect(() => {
        fetchJobs();
    }, [location, careType, payRate, fetchJobs]);

    const renderJobItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.location} - K{item.pay_rate}/hr</Text>
            <Text>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search for Jobs</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Care Type"
                    value={careType}
                    onChangeText={setCareType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Pay Rate"
                    value={payRate}
                    onChangeText={setPayRate}
                    keyboardType="numeric"
                />
                <Button title="Search" onPress={fetchJobs} />
            </View>

            <View style={styles.jobsContainer}>
                <Text style={styles.subtitle}>Available Jobs</Text>
                <FlatList
                    data={jobs}
                    renderItem={renderJobItem}
                    keyExtractor={(item) => item.id.toString()}
                />
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
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    jobsContainer: {
        marginTop: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    jobTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
});

export default CaregiverJobSearch;
