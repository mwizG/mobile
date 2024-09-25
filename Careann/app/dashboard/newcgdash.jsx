import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Make sure FontAwesome is imported
import CGHomeScreen from '../caregiverScreens/CGHomeScreen';
import CGJobScreen from '../caregiverScreens/CGJobScreen';
import MessageScreen from '../screens/MessageScreen';
import { useNavigation } from 'expo-router';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();


export default function CGDashboard() {
  const navigation = useNavigation();
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Jobs') {
              iconName = 'briefcase';
            } else if (route.name === 'Messages') {
              iconName = 'send';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            } 
            // Return FontAwesome Icon
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={CGHomeScreen} />
        <Tab.Screen name="Jobs" component={CGJobScreen}/>
        <Tab.Screen name="Messages" component={MessageScreen}/>
      </Tab.Navigator>
  );
}
