import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function JobDetail() {
    const route = useRoute();
    const { jobId } = route.params;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const acceptJobTime = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/accept-time/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log('Job time accepted:', response.data);
            setJob(response.data); // Update job state to reflect the accepted time
        } catch (error) {
            console.error('Error accepting job time', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    if (!job) {
        return <Text style={styles.error}>Error loading job details.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{job.title}</Text>
            <Text><Text style={styles.label}>Description:</Text> {job.description}</Text>
            <Text><Text style={styles.label}>Location:</Text> {job.location}</Text>
            <Text><Text style={styles.label}>Pay Rate:</Text> ${job.pay_rate}</Text>
            <Text><Text style={styles.label}>Status:</Text> {job.status}</Text>
            <Text><Text style={styles.label}>Proposed Time:</Text> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}</Text>
            {job.proposed_time && (
                <Button title="Accept Proposed Time" onPress={acceptJobTime} />
            )}
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
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default JobDetail;
