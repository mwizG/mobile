import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_care_seeker: false,
    is_caregiver: false,
    location: '',
    bio: '',
    experience: '',
    certifications: '',
    availability: '',
    profile_image: null,
    payment_preference: '',
    experience_categories: '',
    health_status: '',
    contact_info: '',
  });

  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      is_care_seeker: role === 'care_seeker',
      is_caregiver: role === 'caregiver',
    });
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        profile_image: result.assets[0],
      });
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || (!formData.is_care_seeker && !formData.is_caregiver)) {
      setError('Please fill in all required fields and select a role.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'profile_image' && formData[key]) {
          data.append(key, {
            uri: formData[key].uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
          });
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Error', `Registration failed: ${JSON.stringify(error.response.data)}`);
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(value) => handleChange('username', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />

      {/* Role Selection */}
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleRoleChange('care_seeker')}
        >
          <Text style={formData.is_care_seeker ? styles.radioSelected : styles.radioUnselected}>
            Care Seeker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleRoleChange('caregiver')}
        >
          <Text style={formData.is_caregiver ? styles.radioSelected : styles.radioUnselected}>
            Caregiver
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional fields based on role */}
      {formData.is_care_seeker && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(value) => handleChange('location', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Health Status"
            onChangeText={(value) => handleChange('health_status', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Info"
            onChangeText={(value) => handleChange('contact_info', value)}
          />
          <TextInput
            style={styles.textarea}
            placeholder="Tell us more about yourself"
            onChangeText={(value) => handleChange('bio', value)}
            multiline
            numberOfLines={4}
          />
        </>
      )}

      {formData.is_caregiver && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Experience"
            onChangeText={(value) => handleChange('experience', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Certifications"
            onChangeText={(value) => handleChange('certifications', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Availability"
            onChangeText={(value) => handleChange('availability', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Payment Preference"
            onChangeText={(value) => handleChange('payment_preference', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Experience Categories"
            onChangeText={(value) => handleChange('experience_categories', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(value) => handleChange('location', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Info"
            onChangeText={(value) => handleChange('contact_info', value)}
          />
          <TextInput
            style={styles.textarea}
            placeholder="Tell us more about yourself"
            onChangeText={(value) => handleChange('bio', value)}
            multiline
            numberOfLines={4}
          />
        </>
      )}

      <TouchableOpacity style={styles.fileButton} onPress={handleFileChange}>
        <Text style={styles.fileButtonText}>Select Profile Image</Text>
      </TouchableOpacity>

      <Button title="Register" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  textarea: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    paddingTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  radioButton: {
    marginRight: 10,
  },
  radioSelected: {
    fontWeight: 'bold',
    color: 'blue',
  },
  radioUnselected: {
    color: 'black',
  },
  fileButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    alignItems: 'center',
  },
  fileButtonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default Register;
