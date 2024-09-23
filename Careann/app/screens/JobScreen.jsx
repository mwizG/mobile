import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function JobScreen() {
    const navigation = useNavigation();

    return (
      <ScrollView className="flex-1 p-4" contentContainerStyle="justify-center items-center">  
        <View className="flex mb-2">
          <Button className="mb-2" title="Search for Caregivers" onPress={() => navigation.navigate('SearchCaregivers')} />
        </View>    
        <View className="flex mb-2">
          <Button className="mb-2" title="Post a Job" onPress={() => navigation.navigate('JobPostingForm')} />
        </View>         
        <View className="flex mb-2">
          <Button className="mb-2" title="View & Manage Job Listings" onPress={() => navigation.navigate('JobListingManager')} />
        </View>    
        <View className="flex mb-2">
          <Button className="mb-2" title="Messaging" onPress={() => navigation.navigate('Messaging')} />
        </View>       
      </ScrollView>
    );
  };
  
const styles = StyleSheet.create({

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
    notificationsSection: {
      marginTop: 24,
    },
    notificationsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    notificationItem: {
      fontSize: 14,
      marginBottom: 4,
    },
  });
  