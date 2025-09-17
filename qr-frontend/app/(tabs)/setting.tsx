// app/explore.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // clear session
              router.replace('/auth/sign-in'); // redirect to login
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Heading */}
      <Text style={styles.heading}>My Profile</Text>

      {/* User Info (dummy for now) */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>John Doe</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>john.doe@example.com</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#0D3B66', // dark teal-blue
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F1F6FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#008080', // teal (matches login button)
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default ExploreScreen;
