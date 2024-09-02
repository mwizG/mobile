import React from 'react';
import { View, TextInput, Button } from 'react-native';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => (
    <View>
        <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSendMessage} />
    </View>
);

export default MessageInput;
