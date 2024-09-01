import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure this path is correct

type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaregiverDashboard'>;

// app/index.tsx


import CaregiverDashboard from '@/components/Dashboard/CaregiverDashboard';

export default function Index() {
  return <CaregiverDashboard />;
}