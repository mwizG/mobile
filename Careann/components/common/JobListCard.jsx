import React, {useState} from "react";
import { View, Text, Image } from 'react-native';

export default function JobListCard({title,text,image,jobId,}) {
  return (
    <View className="bg-blue-200 rounded-lg shadow-lg m-4 overflow-hidden">
      <Image
        className="h-40 w-full"
        source={{ uri: image ?? 'https://via.placeholder.com/150' }} 
      />
      <View className="p-4">
        <Text className="text-lg font-bold">{ title ?? "Card Title"}</Text>
        <Text className="text-gray-600 mt-2"> {text ?? "This is the description of the card. You can customize it further using NativeWind."}</Text>
      </View>
    </View>
  );
}

