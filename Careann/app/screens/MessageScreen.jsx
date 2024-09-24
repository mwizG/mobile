import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';


// Dummy data for chats
const chatsList = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey there!' },
  { id: '2', name: 'Jane Smith', lastMessage: 'How are you?' },
  { id: '3', name: 'Alice Johnson', lastMessage: 'Let’s meet tomorrow.' },
];

const messages = [
  { id: '1', text: 'Hello!', sender: 'other' },
  { id: '2', text: 'Hi there!', sender: 'me' },
  { id: '3', text: 'How are you?', sender: 'other' },
  { id: '4', text: 'Doing well, how about you?', sender: 'me' },
];

const ChatSidebar = ({ chats, selectChat }) => {
  return (
    <View className="w-64 bg-gray-200 p-4">
      <Text className="text-lg font-bold mb-4">Chats</Text>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <Pressable onPress={() => selectChat(item.id)} className="p-2 border-b border-gray-300">
            <Text className="font-bold">{item.name}</Text>
            <Text>{item.lastMessage}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const ChatMessages = ({ chatMessages }) => {
  return (
    <ScrollView className="flex-1 p-4">
      {chatMessages.map((message) => (
        <View
          key={message.id}
          className={`p-2 my-2 rounded-lg max-w-xs ${message.sender === 'me' ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'}`}
        >
          <Text className={message.sender === 'me' ? 'text-white' : 'text-black'}>{message.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const MessageScreen = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { width } = useWindowDimensions();

  const selectChat = (id) => {
    setSelectedChat(id);
    setSidebarOpen(false); // Close sidebar on mobile when a chat is selected
  };

  return (
    <SafeAreaView className="flex-1 flex-row">
      {/* Sidebar */}
      {sidebarOpen && <ChatSidebar chats={chatsList} selectChat={selectChat} />}

      {/* Main Chat Area */}
      <View className={`flex-1 ${sidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-gray-800">
          <Pressable onPress={() => setSidebarOpen(!sidebarOpen)}>
            <Feather name="menu" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-lg">Chat with {chatsList.find((chat) => chat.id === selectedChat)?.name}</Text>
        </View>

        {/* Messages */}
        <ChatMessages chatMessages={messages} />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
