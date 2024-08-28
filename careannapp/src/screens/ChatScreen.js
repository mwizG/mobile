import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function ChatScreen({ route }) {
  const { conversationId, token } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/messaging/conversations/${conversationId}/messages/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/messaging/conversations/${conversationId}/messages/`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>{item.sender}: {item.content}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={handleSendMessage} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
