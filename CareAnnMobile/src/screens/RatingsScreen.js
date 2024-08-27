import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RatingsScreen({ route, navigation }) {
  const { token } = route.params;
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState('');
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobs/reviews/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reviews');
      }
    };

    fetchReviews();
  }, [token]);

  const handleLeaveReview = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/jobs/rate/',
        { rating: newRating, review: newReview },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setReviews([...reviews, response.data]);
      setNewRating('');
      setNewReview('');
    } catch (err) {
      setError('Failed to leave review');
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
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text>Rating: {item.rating}</Text>
            <Text>Review: {item.review}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        value={newRating}
        onChangeText={setNewRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={newReview}
        onChangeText={setNewReview}
      />
      <Button title="Leave Review" onPress={handleLeaveReview} />
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
  reviewItem: {
    padding: 15,
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
