import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatMessage = ({ route }) => {
    const { conversationId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`${BASE_URL}/messaging/conversations/${conversationId}/messages/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data);
        };

        fetchMessages();
    }, [conversationId]);

    const handleSendMessage = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        await axios.post(`${BASE_URL}/messaging/conversations/${conversationId}/messages/`, {
            content: newMessage,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setNewMessage('');
        fetchMessages(); // Refresh the message list after sending a message
    };

    return (
        <View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Text>{item.content}</Text>}
            />
            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message"
            />
            <Button title="Send" onPress={handleSendMessage} />
        </View>
    );
};

export default ChatMessage;
