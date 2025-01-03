import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind'; // NativeWind for styling
import { SafeAreaView } from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const experienceOptions = [
  { id: 1, name: 'Respite Care' },
  { id: 2, name: 'Home Care' },
  { id: 3, name: 'Senior Care' },
  { id: 4, name: 'Child Care' },
  { id: 5, name: 'Disability Care' },
  { id: 6, name: 'Palliative Care' },
  { id: 7, name: 'Post-Surgical Care' },
  { id: 8, name: 'Maternity Care' },
  { id: 9, name: 'Dementia Care' },
];

// Styled components with NativeWind
const Container = styled(View, 'flex-1 items-center bg-gray-100 p-4');
const TabContainer = styled(View, 'flex-row');
const Tab = styled(TouchableOpacity, 'flex-1 p-4 border-b-2');
const ActiveTab = styled(Tab, 'border-blue-500');
const InactiveTab = styled(Tab, 'border-transparent');
const Input = styled(TextInput, 'border p-3 w-full mb-4 rounded-lg text-gray-700');

const Register = () => {
  const [activeTab, setActiveTab] = useState('care_seeker'); // Track active tab
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_care_seeker: true,
    is_caregiver: false,
    location: '',
    bio: '',
    experience_cat1: '',
    experience_cat2: '',
    experience_cat3: '',
    certifications: '',
    health_status: '',
    contact_info: '',
    profile_image: null,
  });
  
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Handle form input change
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleExperienceChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Switch between tabs
  const handleRoleChange = (role) => {
    setActiveTab(role);
    setFormData({
      ...formData,
      is_care_seeker: role === 'care_seeker',
      is_caregiver: role === 'caregiver',
    });
  };
  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('Please fill out all fields');
      return;
    }
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.navigate('login');
    } catch (error) {
      if (error.response) {
        console.error('Registration failed', error.response.data);
        alert(`Registration failed: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received', error.request);
        alert('No response from the server, please try again later.');
      } else {
        console.error('Error', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor='white' barStyle="dark-content" />
      <TabContainer className='flex-row w-full justify-between items-center p-4 bg-white shadow-md'>
          <TouchableOpacity
            
            onPress={() => handleRoleChange('care_seeker')}
            style={activeTab === 'care_seeker' ? ActiveTab : InactiveTab}
          >
            <Text className={ ` text-center ${activeTab === 'care_seeker' ? 'text-green-500' : 'text-black'} `}>Register as Care Seeker</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleRoleChange('caregiver')}
            style={activeTab === 'caregiver' ? ActiveTab : InactiveTab}
          >
            <Text className={ ` text-center ${activeTab === 'caregiver' ? 'text-green-500' : 'text-black'} `}>Register as Care Giver</Text>
          </TouchableOpacity>
        </TabContainer>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Container>
        {/* Tab Navigation */}
        

        {/* Registration Form */}
        <Text className="text-2xl font-bold mb-6">
          {activeTab === 'care_seeker' ? 'Care Seeker Registration' : 'Care Giver Registration'}
        </Text>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        <Input
          placeholder="First Name"
          value={formData.first_name}
          onChangeText={(value) => handleChange('first_name', value)}
        />
        <Input
          placeholder="Last Name"
          value={formData.last_name}
          onChangeText={(value) => handleChange('last_name', value)}
        />
        <Input
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        {/* Conditional Fields Based on Role */}
        {formData.is_care_seeker && formData.password && (
          <>
            <Input
              placeholder="Location"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <Input
              placeholder="Health Status"
              value={formData.health_status}
              onChangeText={(value) => handleChange('health_status', value)}
            />
            <Input
              placeholder="Contact Info"
              value={formData.contact_info}
              onChangeText={(value) => handleChange('contact_info', value)}
            />
            <Input
              placeholder="Tell us more about yourself"
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              multiline
              numberOfLines={4}
            />
          </>
        )}

        {formData.is_caregiver && formData.password && (
          <>
            
            <Input
              placeholder="Tell us more about yourself"
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              multiline
              numberOfLines={4}
            />
            <Input
              placeholder="Certifications"
              value={formData.certifications}
              onChangeText={(value) => handleChange('certifications', value)}
            />
            <Input
              placeholder="Contact Info"
              value={formData.contact_info}
              onChangeText={(value) => handleChange('contact_info', value)}
            />
            <Input
              placeholder="Availability"
              value={formData.availability}
              onChangeText={(value) => handleChange('availability', value)}
            />
            <Input
              placeholder="Payment Preference"
              value={formData.payment_preference}
              onChangeText={(value) => handleChange('payment_preference', value)}
            />
            <View className="flex-1 p-4">
              {/* Experience Category 1 Dropdown */}
              <View className="mb-4">
                <Text className="mb-1 text-lg">Experience Category 1</Text>
                <Picker
                  selectedValue={formData.experience_cat1}
                  onValueChange={(itemValue) => handleExperienceChange('experience_cat1', itemValue)}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  {experienceOptions.map((option) => (
                    <Picker.Item key={option.id} label={option.name} value={option.id} />
                  ))}
                </Picker>
              </View>

              {/* Experience Category 2 Dropdown */}
              <View className=" mb-4">
                <Text className="mb-1 text-lg">Experience Category 2</Text>
                <Picker
                  selectedValue={formData.experience_cat2}
                  onValueChange={(itemValue) => handleExperienceChange('experience_cat2', itemValue)}
                  className=" border border-gray-300 p-2 rounded-md"
                >
                  {experienceOptions.map((option) => (
                    <Picker.Item key={option.id} label={option.name} value={option.id} />
                  ))}
                </Picker>
              </View>

              {/* Experience Category 3 Dropdown */}
              <View className="mb-4">
                <Text className="mb-1 text-lg">Experience Category 3</Text>
                <Picker
                  selectedValue={formData.experience_cat3}
                  onValueChange={(itemValue) => handleExperienceChange('experience_cat3', itemValue)}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  {experienceOptions.map((option) => (
                    <Picker.Item key={option.id} label={option.name} value={option.id} />
                  ))}
                </Picker>
              </View>
            </View>
            <Input
              placeholder="Location"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
            />
          </>
        )}

        <Button title="Register" onPress={handleSubmit} />
      </Container>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
