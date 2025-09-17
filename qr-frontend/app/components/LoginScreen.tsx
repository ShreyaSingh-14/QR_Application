import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../../config/FirebaseConfig'; // adjust path if needed

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in:', userCredential.user);
      router.push('/enterDetails'); // navigate on success
    } catch (error: any) {
      console.error('Login failed:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter Email', 'Please enter your email to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'Check your email for reset link.');
    } catch (error: any) {
      console.error('Reset failed:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const handleRegister = () => {
    router.push('/components/register'); // you can create a register screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e7a7a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Image
            source={{ uri: 'https://via.placeholder.com/24x24' }}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter email and password to login</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email ID"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? 'open' : 'close'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Or Divider */}
        <Text style={styles.orText}>Or</Text>

        {/* Google Login Button (disabled for now) */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => Alert.alert('Not Implemented', 'Google login needs expo-auth-session setup.')}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>terms of service</Text> and{' '}
            <Text style={styles.link}>privacy policy</Text>.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// your styles remain the same...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C788D' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 30,
    backgroundColor: '#0C788D',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 24, height: 24, marginRight: 8 },
  content: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  eyeButton: { padding: 12 },
  eyeIcon: { fontSize: 12 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotPasswordText: { color: '#1e7a7a', fontSize: 16, fontWeight: '500' },
  continueButton: {
    backgroundColor: '#0C788D',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  orText: { textAlign: 'center', color: '#999', fontSize: 16, marginBottom: 24 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 32,
    backgroundColor: 'white',
  },
  googleIcon: { fontSize: 18, marginRight: 12, fontWeight: 'bold', color: '#f44242ff' },
  googleButtonText: { fontSize: 16, color: '#333', fontWeight: '500' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  registerText: { fontSize: 16, color: '#666' },
  registerLink: { fontSize: 16, color: '#1e7a7a', fontWeight: '600' },
  termsContainer: { paddingHorizontal: 16, marginBottom: 24 },
  termsText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  link: { color: '#1e7a7a', textDecorationLine: 'underline' },
});

export default LoginScreen;
