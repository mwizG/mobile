import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConversationList = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`${BASE_URL}/messaging/conversations/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConversations(response.data);
        };

        fetchConversations();
    }, []);

    return (
        <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatMessage', { conversationId: item.id })}>
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default ConversationList;
