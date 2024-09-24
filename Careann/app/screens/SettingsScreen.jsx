import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React from 'react';

export default function SettingsScreen() {
  return (
    <View className='flex-1 justify-center items-center bg-blue-500'>
      <Text className='text-white text-xl font-bold'>
        Settings Screen
      </Text>
    </View>
  );
}
