import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AdminDashboard() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.welcomeMessage}>
                Welcome to your dashboard. From here, you can manage all aspects of the platform efficiently.
            </Text>

            <View style={styles.dashboardOptions}>
                <Button title="Manage Users" onPress={() => navigation.navigate('UserManagement')} />
                <Button title="Content Moderation" onPress={() => navigation.navigate('ContentModeration')} />
                <Button title="Payment Oversight" onPress={() => navigation.navigate('PaymentOversight')} />
                <Button title="Analytics & Reporting" onPress={() => navigation.navigate('Analytics')} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    welcomeMessage: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    dashboardOptions: {
        marginBottom: 24,
    },
});

export default AdminDashboard;
