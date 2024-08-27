import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function PaymentsScreen({ route, navigation }) {
  const { token } = route.params;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/payments/history/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payments');
      }
    };

    fetchPayments();
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
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text>Payment to: {item.caregiver}</Text>
            <Text>Amount: ${item.amount}</Text>
            <Text>Status: {item.status}</Text>
          </View>
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
  paymentItem: {
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
