import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({
    '2024-09-15': { marked: true, dotColor: 'red', activeOpacity: 0 }, // Example of a marked date
  });

  const onDayPress = (day) => {
    const newMarkedDates = { ...markedDates };
    if (newMarkedDates[day.dateString]) {
      delete newMarkedDates[day.dateString]; // Unmark the date if it's already marked
    } else {
      newMarkedDates[day.dateString] = { marked: true, dotColor: 'blue' }; // Mark the date
    }
    setMarkedDates(newMarkedDates);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Your Availability</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        style={styles.calendar}
      />
      <Text style={styles.instructions}>Tap on a date to mark/unmark your availability.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});
