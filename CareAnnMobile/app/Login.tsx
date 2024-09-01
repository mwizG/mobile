import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure this path is correct

type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// app/index.tsx

import Home from '../src/screens/Login';
import Login from '../src/screens/Login';

export default function Index() {
  return <Login />;
}