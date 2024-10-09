import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker'; // For iOS dropdowns

const LocationPicker = ({location,setLocation}) => {
  const [locations, setLocations] = useState([]); // List of available locations
  const [loading, setLoading] = useState(true); // Loading state
  const [open, setOpen] = useState(false); // Control for DropDownPicker visibility

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('User is not logged in. Please log in to continue.');
          return;
        }

        const response = await axios.get('http://192.168.219.59:8000/api/jobs/locations/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map the response to the format DropDownPicker expects
        const locationOptions = response.data.map((loc) => ({
          label: loc.name,
          value: loc.id,
        }));

        setLocations(locationOptions); // Set locations in the correct format
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching locations', error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <Text>Loading locations...</Text>;
  }

  return (
    <View className={`mb-2 ${location ? 'border-green-500' : 'border-gray-300'} border rounded-lg`}>
      <Text className="text-lg mb-2">Select Location:</Text>
      {Platform.OS === 'ios' ? (
        <DropDownPicker
          open={open}
          value={location}
          items={locations} // Use the locations fetched from the API
          setOpen={setOpen}
          setValue={setLocation}
          setItems={setLocations}
          placeholder="Select a location"
          containerStyle={{ height: 40 }}
          style={{ backgroundColor: '#fafafa' }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
        />
      ) : (
        <Picker
          selectedValue={location}
          onValueChange={(itemValue) => setLocation(itemValue)}
        >
          {locations.length > 0 ? (
            locations.map((loc) => (
              <Picker.Item label={loc.label} value={loc.value} key={loc.value} />
            ))
          ) : (
            <Picker.Item label="No locations available" value="" />
          )}
        </Picker>
      )}
    </View>
  );
};

export default LocationPicker;
