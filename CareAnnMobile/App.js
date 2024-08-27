import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobListScreen from './screens/JobListScreen';
import ChatScreen from './screens/ChatScreen';
import ConversationsScreen from './screens/ConversationsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import RatingsScreen from './screens/RatingsScreen';
import CaregiverScheduleScreen from './screens/CaregiverScheduleScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Jobs" component={JobListScreen} />
        <Stack.Screen name="Conversations" component={ConversationsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Ratings" component={RatingsScreen} />
        <Stack.Screen name="CaregiverSchedule" component={CaregiverScheduleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
