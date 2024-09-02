import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ContactInfo = ({ onSave }) => {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    address: '',
  });

  const handleChange = (name, value) => {
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = () => {
    onSave(contactInfo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={contactInfo.phone}
        onChangeText={(value) => handleChange('phone', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={contactInfo.address}
        onChangeText={(value) => handleChange('address', value)}
      />
      <Button title="Save Contact Info" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ContactInfo;
