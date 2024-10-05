import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get } from '../../services/api'; // Import the get function from api.js
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

function CaregiverDashboard() {
    const [applications, setApplications] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Retrieve token from AsyncStorage
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                // Fetch job applications using the get method from api.js
                const response = await get('/jobs/applications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Add the token in the Authorization header
                    },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications', error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Caregiver Dashboard</Text>
            <Text style={styles.welcomeMessage}>
                Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.
            </Text>

            <View style={styles.dashboardOptions}>
                <Button title="Search for Jobs" onPress={() => navigation.navigate('SearchJobs')} />
                <Button title="View Available Jobs" onPress={() => navigation.navigate('JobList')} />
                <Button title="View & Manage Applications" onPress={() => navigation.navigate('ManageApplications')} />
                <Button title="View & Manage Jobs" onPress={() => navigation.navigate('ManageJobs')} />
                <Button title="Manage Schedule & Availability" onPress={() => navigation.navigate('Scheduler')} />
                <Button title="Task Management" onPress={() => navigation.navigate('TaskManagement')} />
                <Button title="Job History" onPress={() => navigation.navigate('JobHistory')} />
                <Button title="Messaging" onPress={() => navigation.navigate('Messaging')} />
                <Button title="View & Manage Reviews" onPress={() => navigation.navigate('ManageReviews')} />
                <Button title="Manage Payments" onPress={() => navigation.navigate('PaymentHistory')} />
                <Button title="View Analytics" onPress={() => navigation.navigate('Analytics')} />
                <Button title="Learning & Resources" onPress={() => navigation.navigate('LearningResources')} />
                <Button title="Client Feedback" onPress={() => navigation.navigate('ClientFeedback')} />
                <Button title="Emergency Contacts" onPress={() => navigation.navigate('EmergencyContacts')} />
                <Button title="Support & Help" onPress={() => navigation.navigate('Support')} />
                <Button title="Manage Subscriptions" onPress={() => navigation.navigate('Subscriptions')} />
                <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
            </View>
            <View>
                {/* Other dashboard features */}
                <Button title="Messaging" onPress={() => navigation.navigate('ConversationList')} />
            </View>
            <View style={styles.applicationsSection}>
                <Text style={styles.subTitle}>Job Applications</Text>
                <View>
                    {applications.map((application) => (
                        <TouchableOpacity
                            key={application.id}
                            onPress={() => navigation.navigate('ApplicationDetails', { jobId: application.job })}
                            style={styles.applicationItem}
                        >
                            <Text style={styles.applicationText}>
                                <Text style={styles.applicationJob}>{application.job}</Text> - Status: {application.status}
                            </Text>
                            {application.status === 'Accepted' && application.job.proposed_time && (
                                <Text style={styles.proposedTime}>
                                    Proposed Time: {new Date(application.job.proposed_time).toLocaleString()}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    welcomeMessage: {
        fontSize: 16,
        marginBottom: 16,
    },
    dashboardOptions: {
        marginBottom: 24,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    applicationsSection: {
        marginTop: 24,
    },
    applicationItem: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    applicationText: {
        fontSize: 14,
    },
    applicationJob: {
        fontWeight: 'bold',
    },
    proposedTime: {
        fontSize: 12,
        color: '#555',
    },
});

export default CaregiverDashboard;
