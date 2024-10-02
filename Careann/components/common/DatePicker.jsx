import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const JobDatePicker = ({ onChange }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [scheduledTime, setScheduledTime] = useState(new Date());
  
    const onChangeTime = (event, selectedTime) => {
      setShowTimePicker(false); // Close the picker after selecting time
      if (selectedTime) {
        setScheduledTime(selectedTime);
        onChange(selectedTime); // Pass the selected time to the parent
      }
    };

  return (
    <>
        <TouchableOpacity className="flex-1" onPress={() => setShowTimePicker(true)}>
          <Text className=" text-lg mb-2 p-4 border border-green-500  rounded-lg">
          {scheduledTime.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={scheduledTime}
          mode="date"
          display="default"
          onChange={onChangeTime}
        />
      )}

    </>
  );
};

export default JobDatePicker;
