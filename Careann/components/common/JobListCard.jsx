import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

export default function JobListCard({ jobDetail, onCardClick }) {
  return (
    <Pressable className="flex bg-white rounded-lg shadow-lg m-4 "
      onPress={() => onCardClick()}>
      <View className="flex p-4">
        <Text className="text-lg font-bold">
          {jobDetail?.title ?? "Card Title"}
        </Text>

        <Text className="text-gray-600 mt-2">
          {" "}
          {jobDetail?.description ??
            "This is the description of the card. You can customize it further using NativeWind."}
        </Text>
      </View>
      <View className="w-max h-[1px] bg-gray-200 mx-3" />
      <View className="flex-row gap-2 justify-end p-4">
        {jobDetail?.author?.profileImage ? (
          <Image
            source={{ uri: jobDetail.author.profileImage }}
            className="w-10 h-10 rounded-full"
          />
        ) : null}

        <Text className="text-indigo-400">
          {jobDetail?.author?.username ?? "careseeker username"}
        </Text>
      </View>
    </Pressable>
  );
}
