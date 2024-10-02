import React, {useState} from 'react';
import { StatusBar,Pressable,View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';



const CardComponent = ({title,image,onPress}) =>{
  return (
    <Pressable onPress={onPress} className="flex-col w-32 h-48 bg-green-400 shadow rounded-md items-center justify-center">
      <Text className=" p-2 text-xl text-center">
        {title}
      </Text>
    </Pressable>
  );
}
  
export default function CGJobScreen() {
  const navigation = useNavigation();
  const [clicked, setClicked] = useState('');
  return (
    <SafeAreaView className="flex-1 justify-center bg-gray-50 p-4">
      <View className="flex">

      </View>
      {/* card options*/}
      <View className="flex">
        <View className="flex justify-center flex-row">
          <View className="p-4">
            <CardComponent title={"Search For a Job"} onPress={()=> navigation.navigate('SearchJobs')}/>
          </View>
          <View className="p-4" >
            <CardComponent className="" title={"View & Manage Jobs"} onPress={()=> navigation.navigate('JobListingManager')}/>
          </View>
        </View>
        <View className="flex justify-center flex-row ">
          <View className="p-4">
            <CardComponent title={"Search For Caregivers"} onPress={()=> navigation.navigate('SearchCaregivers')}/>
          </View>
          <View className="p-4" >
            <CardComponent className="" title={"Upcoming Jobs"} onPress={()=> navigation.navigate('Scheduler')}/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}