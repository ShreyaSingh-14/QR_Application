import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignIn() {
  const navigation = useNavigation<any>(); 
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const OnSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill all the details...', ToastAndroid.LONG);
      return;
    }
    setIsLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      ToastAndroid.show('Please enter a valid email address.', ToastAndroid.LONG);
      setIsLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/(tabs)/home');
        console.log('User signed in:', user);
      })
      .catch((error: any) => {  
        let message = '';
        switch (error.code) {
          case 'auth/invalid-email':
            message = 'The email address is badly formatted.';
            break;
          case 'auth/user-not-found':
            message = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password.';
            break;
          default:
            message = 'Error signing in. Please try again.';
        }
        ToastAndroid.show(message, ToastAndroid.LONG);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter email and password to login</Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email ID"
          placeholderTextColor="#999"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Sign In Button with Gradient */}
      <TouchableOpacity onPress={OnSignIn} disabled={isLoading} style={styles.signInWrapper}>
        <LinearGradient colors={['#008080', '#0D98BA']} style={styles.signInButton}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInText}>Continue</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* OR divider */}
      <Text style={styles.orText}>Or</Text>

      {/* Google Sign In */}
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Register */}
      <TouchableOpacity
        onPress={() => router.replace('/auth/sign-up')}
        style={styles.registerWrapper}
      >
        <Text style={styles.registerText}>
          Don’t have an account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footerNote}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>terms of service</Text> and{' '}
        <Text style={styles.link}>privacy policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0D3B66',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: '#008080',
    fontWeight: '500',
  },
  signInWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  signInButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    color: '#777',
  },
  googleBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  googleText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  registerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#777',
  },
  registerLink: {
    color: '#008080',
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: '#008080',
  },
});
