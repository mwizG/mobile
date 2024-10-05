import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postJob } from '../../services/jobService'; // Assuming postJob is imported correctly
import { Picker } from '@react-native-picker/picker';
import JobTimePicker from '../common/TimePicker';
import JobDatePicker from '../common/DatePicker';
import axios from 'axios';

const jobTypes = [
  'Respite Care',
  'Home Care',
  'Senior Care',
  'Child Care',
  'Disability Care',
  'Palliative Care',
  'Post-Surgical Care',
  'Maternity Care',
  'Dementia Care',
];

const JobTypeDropdown = ({ selectedJobType, setSelectedJobType }) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>Select Job Type:</Text>
      <Picker
        selectedValue={selectedJobType}
        onValueChange={(itemValue) => setSelectedJobType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Job Type" value="" />
        {jobTypes.map((job, index) => (
          <Picker.Item label={job} value={job} key={index} />
        ))}
      </Picker>
    </View>
  );
};

const JobPostingForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [payRate, setPayRate] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedJobType, setSelectedJobType] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('User not logged in.');
          return;
        }

        const response = await axios.get('http://192.168.251.86:8000/api/jobs/locations/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations', error);
      }
    };

    fetchLocations();
  }, []);

  const valid = title && description && location && payRate && selectedJobType && scheduledDate && selectedTime;

  const handlePostJob = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Combine date and time into a single DateTime object
      const scheduledDateTime = new Date(
        scheduledDate.getFullYear(),
        scheduledDate.getMonth(),
        scheduledDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      const jobData = {
        title,
        description,
        location,
        job_type: selectedJobType,
        pay_rate: payRate,
        scheduled_time: scheduledDateTime.toISOString(),
      };

      await postJob(jobData, token);

      Alert.alert('Success', 'Job posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error posting job', error);
      Alert.alert('Error', 'Something went wrong while posting the job.');
    }
  };

  const onChangePay = (input) => {
    const formattedInput = input.replace(/[^0-9.]/g, '');
    setPayRate(formattedInput);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, title ? styles.validInput : styles.invalidInput]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, description ? styles.validInput : styles.invalidInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Location:</Text>
          <Picker
            selectedValue={location}
            onValueChange={(itemValue) => setLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Location" value="" />
            {locations.map((loc) => (
              <Picker.Item key={loc.id} label={loc.name} value={loc.name} />
            ))}
          </Picker>
        </View>
        <JobTypeDropdown selectedJobType={selectedJobType} setSelectedJobType={setSelectedJobType} />

        <View style={[styles.inputContainer, payRate ? styles.validInput : styles.invalidInput]}>
          <Text style={styles.label}>ZMW</Text>
          <TextInput
            style={styles.payRateInput}
            keyboardType="numeric"
            placeholder="Enter pay rate"
            value={payRate}
            onChangeText={onChangePay}
          />
        </View>

        <JobDatePicker onTimeChange={setScheduledDate} />
        <JobTimePicker onTimeChange={setSelectedTime} />

        <Pressable
          style={[styles.submitButton, valid ? styles.validButton : styles.invalidButton]}
          onPress={handlePostJob}
          disabled={!valid}
        >
          <Text style={styles.buttonText}>Post Job</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0f2e9',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  validInput: {
    borderColor: '#4caf50',
  },
  invalidInput: {
    borderColor: '#ccc',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  payRateInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  submitButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  validButton: {
    backgroundColor: '#4caf50',
  },
  invalidButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default JobPostingForm;
