import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure this path is correct

type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// app/index.tsx

import Home from '../src/screens/Home';

export default function Index() {
  return <Home />;
}