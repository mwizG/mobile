import React from "react";
import {
  View,
  Text,
  Pressable
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const AppBar = ({ onNotificationPress, onProfilePress }) => {
    return (
      <View className="flex-row px-4 py-1 justify-between items-center bg-white">
        <Text className="text-lg ">Careann</Text>
        <View className="flex-row p-2 gap-4">
          <Pressable onPress={onNotificationPress}>
            <FontAwesome name="bell" size={24} color="black" />
            
          </Pressable>
          <Pressable onPress={onProfilePress}>
            <FontAwesome name="user" size={24} color="black" />
            
          </Pressable>
        </View>
      </View>
    );
  };

export default AppBar;