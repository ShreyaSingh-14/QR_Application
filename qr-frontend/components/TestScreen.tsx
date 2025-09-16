// components/TestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type User = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  authProvider: string;
  createdAt: string;
};

export const TestScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/users'); // make sure URL matches backend
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <View key={user._id} style={styles.userCard}>
          <Text style={styles.name}>{user.name}</Text>
          <Text>{user.email}</Text>
          <Text>{user.authProvider}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  userCard: { marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6 },
  name: { fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red' },
});
