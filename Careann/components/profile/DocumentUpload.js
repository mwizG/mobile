import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const DocumentUpload = () => {
  const [document, setDocument] = useState(null);

  const handleDocumentUpload = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setDocument(result);
      // You can handle the document upload logic here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>
      <Button title="Choose Document" onPress={handleDocumentUpload} />
      {document && <Text style={styles.documentName}>{document.name}</Text>}
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
  documentName: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default DocumentUpload;
