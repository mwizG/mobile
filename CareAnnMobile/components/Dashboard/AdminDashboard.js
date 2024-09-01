import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AdminDashboard() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserManagement')}>
                    <Text style={styles.buttonText}>User Management</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ContentModeration')}>
                    <Text style={styles.buttonText}>Content Moderation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PaymentManagement')}>
                    <Text style={styles.buttonText}>Payment Management</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DisputeResolution')}>
                    <Text style={styles.buttonText}>Dispute Resolution</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AnalyticsReporting')}>
                    <Text style={styles.buttonText}>Analytics & Reporting</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SupportTickets')}>
                    <Text style={styles.buttonText}>Support Tickets</Text>
                </TouchableOpacity>
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
    optionsContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AdminDashboard;
