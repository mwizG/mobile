import React from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const StyledPressable = styled(Pressable)

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
          <Pressable
            className="bg-green-500 p-1 rounded items-center"
            onPress={() => navigation.navigate('login')}
          >
            <Text className="text-lg text-white">
              LOGIN
            </Text>
          </Pressable>
        </View>
        <View>
        <Pressable
            className="bg-blue-500 p-1 rounded items-center"
            onPress={() => navigation.navigate('register')}
          >
            <Text className="text-lg text-white">
              REGISTER
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
