import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors'; 

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../assets/images/icon.png')} 
        style={{
          width: '100%',
          height: 520,
          backgroundColor: Colors.WHITE
        }}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>
         QR Generator
        </Text>

        <Text style={styles.description}>
          Generate and save QR codes easily with our app. Get started now to explore the features!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth/sign-up')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 30,
    paddingBottom: 30,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GRAY,
    lineHeight: 24,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
});
