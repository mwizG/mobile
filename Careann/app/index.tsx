import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header and Navigation */}
      <View style={styles.header}>
        <Text style={styles.title}>CareAnn</Text>
        <View style={styles.nav}>
          <Button title="services" onPress={() => navigation.navigate('Services')} />
          <Button title="How It Works" onPress={() => navigation.navigate('HowItWorks')} />
          <Button title="Contact Us" onPress={() => navigation.navigate('Contact')} />
          <Button title="FAQ" onPress={() => navigation.navigate('FAQ')} />
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.subtitle}>Welcome to CareAnn</Text>
        <Text>Your trusted platform to connect care seekers with caregivers.</Text>
        <View style={styles.homeOptions}>
          <Button title="login" onPress={() => navigation.navigate('login')} />
          <Button title="register" onPress={() => navigation.navigate('register')} />
        </View>
      </View>

      {/* Service Overview Section */}
      <View style={styles.servicesOverview}>
        <Text style={styles.subtitle}>Our Services</Text>
        <View style={styles.servicesList}>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>Respite Care</Text>
            <Text>Temporary relief for primary caregivers.</Text>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>Home Care</Text>
            <Text>Personal care services provided at home.</Text>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>Senior Care</Text>
            <Text>Specialized care for elderly individuals.</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.subtitle}>About CareAnn</Text>
        <Text>
          CareAnn is a platform designed to connect individuals seeking care services
          with caregivers offering those services. Whether you need child care, senior
          care, or housekeeping, CareAnn is here to help.
        </Text>
      </View>

      {/* Search Bar for Caregivers */}
      <View style={styles.searchSection}>
        <Text style={styles.subtitle}>Find a Caregiver</Text>
        <View style={styles.searchForm}>
          <TextInput style={styles.searchInput} placeholder="Enter your location" />
          <Button title="Search" onPress={() => { /* Implement search functionality */ }} />
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.subtitle}>What Our Users Say</Text>
        <View style={styles.testimonialsList}>
          <Text>"CareAnn helped us find the perfect caregiver for my mother."</Text>
          <Text>— Sarah J.</Text>
          <Text>"The platform is easy to use and has great support."</Text>
          <Text>— John D.</Text>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text>&copy; 2024 CareAnn. All rights reserved.</Text>
        <View style={styles.nav}>
          <Button title="Terms of Service" onPress={() => navigation.navigate('Terms')} />
          <Button title="Privacy Policy" onPress={() => navigation.navigate('Privacy')} />
          <Button title="Contact" onPress={() => navigation.navigate('Contact')} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  welcomeSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  homeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  servicesOverview: {
    marginBottom: 20,
  },
  servicesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  searchSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  searchForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
  },
  testimonialsSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  testimonialsList: {
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Home;
