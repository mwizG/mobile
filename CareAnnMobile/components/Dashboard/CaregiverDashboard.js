import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function CaregiverDashboard() {
    const [applications, setApplications] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications', error);
            }
        };

        fetchApplications();
    }, []);

    const renderApplication = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ApplicationDetails', { jobId: item.job })}>
            <Text style={styles.jobTitle}>{item.job}</Text>
            <Text>Status: {item.status}</Text>
            {item.status === 'Accepted' && item.job.proposed_time && (
                <Text>Proposed Time: {new Date(item.job.proposed_time).toLocaleString()}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Caregiver Dashboard</Text>
            <Text>Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.</Text>

            <View style={styles.buttonContainer}>
                <Button title="Search for Jobs" onPress={() => navigation.navigate('SearchJobs')} />
                <Button title="View Available Jobs" onPress={() => navigation.navigate('AvailableJobs')} />
                <Button title="View & Manage Applications" onPress={() => navigation.navigate('ManageApplications')} />
                <Button title="View & Manage Jobs" onPress={() => navigation.navigate('ManageJobs')} />
                <Button title="Manage Schedule & Availability" onPress={() => navigation.navigate('ManageSchedule')} />
                <Button title="Task Management" onPress={() => navigation.navigate('TaskManagement')} />
                <Button title="Job History" onPress={() => navigation.navigate('JobHistory')} />
                <Button title="Messaging" onPress={() => navigation.navigate('Messaging')} />
                <Button title="View & Manage Reviews" onPress={() => navigation.navigate('ManageReviews')} />
                <Button title="Manage Payments" onPress={() => navigation.navigate('ManagePayments')} />
                <Button title="View Analytics" onPress={() => navigation.navigate('ViewAnalytics')} />
                <Button title="Learning & Resources" onPress={() => navigation.navigate('Resources')} />
                <Button title="Client Feedback" onPress={() => navigation.navigate('ClientFeedback')} />
                <Button title="Emergency Contacts" onPress={() => navigation.navigate('EmergencyContacts')} />
                <Button title="Support & Help" onPress={() => navigation.navigate('Support')} />
                <Button title="Manage Subscriptions" onPress={() => navigation.navigate('ManageSubscriptions')} />
                <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
            </View>

            <View style={styles.applicationsSection}>
                <Text style={styles.sectionTitle}>Job Applications</Text>
                <FlatList
                    data={applications}
                    renderItem={renderApplication}
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
    buttonContainer: {
        marginBottom: 20,
    },
    jobTitle: {
        fontWeight: 'bold',
    },
    applicationsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default CaregiverDashboard;
