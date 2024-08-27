import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ConversationsScreen({ route, navigation }) {
  const { token } = route.params;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load conversations');
      }
    };

    fetchConversations();
  }, [token]);

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
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { conversationId: item.id, token })}
          >
            <View style={styles.conversationItem}>
              <Text>Conversation with {item.participants.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
