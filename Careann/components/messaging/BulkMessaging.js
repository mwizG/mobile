import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BulkMessaging = () => {
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState([]); // Array of recipient IDs

    const handleSendBulkMessage = async () => {
        const token = await AsyncStorage.getItem('token');
        await axios.post(`${BASE_URL}/messaging/bulk/`, {
            content: message,
            recipients,
        }, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        setMessage('');
        // Optionally notify the user that messages were sent successfully
    };

    return (
        <View>
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message"
            />
            <Button title="Send to All" onPress={handleSendBulkMessage} />
        </View>
    );
};

export default BulkMessaging;
