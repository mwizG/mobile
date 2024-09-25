import React from 'react';
import { View, Text, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

export default function LandingPage() {
  const navigation = useNavigation();

  return (
    <LinearGradient
    colors={['#00bcd4','#ffffff', '#4CAF50']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Header with styled "CareAnn" */}
      <Text className="text-black text-4xl font-bold ">
        Care
        <Text className="text-green-500">Ann</Text>
      </Text>

      {/* Login and Register Buttons */}
      <View className=" rounded mt-8 w-full px-8">
        <View className="mb-4">
          <Button
            title="Login"
            color="#4CAF50"
            onPress={() => navigation.navigate('login')}
          />
        </View>
        <View>
          <Button
            title="Register"
            color="#2196F3"
            onPress={() => navigation.navigate('register')}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
