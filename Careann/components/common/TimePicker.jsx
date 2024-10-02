import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const JobTimePicker = ({ onTimeChange }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [scheduledTime, setScheduledTime] = useState(new Date());
  
    const onChangeTime = (event, selectedTime) => {
      setShowTimePicker(false); // Close the picker after selecting time
      if (selectedTime) {
        setScheduledTime(selectedTime);
        onTimeChange(selectedTime); // Pass the selected time to the parent
      }
    };

  return (
    <>
        <TouchableOpacity className="flex-1" onPress={() => setShowTimePicker(true)}>
          <Text className="text-lg mb-2 p-4 border border-green-500 rounded-lg">
          {scheduledTime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={scheduledTime}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

    </>
  );
};

export default JobTimePicker;
