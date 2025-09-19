import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';

const EnterDetailsScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [qrLink, setQrLink] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  
  const businessTypes = [
    'Restaurant',
    'Retail Store',
    'Service Provider',
    'Healthcare',
    'Education',
    'Technology',
    'Manufacturing',
    'Other',
  ];

  // Validation function
  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!uniqueId.trim()) {
      Alert.alert('Validation Error', 'Please enter a unique ID');
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return false;
    }
    if (!emailId.trim() || !emailId.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (!businessName.trim()) {
      Alert.alert('Validation Error', 'Please enter your business name');
      return false;
    }
    if (!businessType) {
      Alert.alert('Validation Error', 'Please select a business type');
      return false;
    }
    if (!businessAddress.trim()) {
      Alert.alert('Validation Error', 'Please enter your business address');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = {
        fullName,
        uniqueId,
        phoneNumber,
        emailId,
        businessName,
        businessType,
        businessAddress,
        businessDescription,
        qrLink: qrLink || `https://scantowall.com/business/${uniqueId}`, 
      };
      
      console.log('Form submitted:', formData);
      
      
      const queryParams = new URLSearchParams({
        link: formData.qrLink,
        userId: uniqueId,
        businessName: businessName,
      }).toString();
      
     router.replace('/(tabs)/home');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.replace("/auth/sign-in");
  };

  const getCharacterCount = (text: string, limit: number) => {
    return `${text.length}/${limit}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e7a7a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Details</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        extraScrollHeight={100}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. Raj Verma"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Unique ID */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unique ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. raj_verma_45"
            placeholderTextColor="#999"
            value={uniqueId}
            onChangeText={setUniqueId}
            autoCapitalize="none"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone number *</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. 9876543210"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Email ID */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. raj.verma@email.com"
            placeholderTextColor="#999"
            value={emailId}
            onChangeText={setEmailId}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Business Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business name *</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="eg. Verma pure veg Elite dine Restaurant..."
              placeholderTextColor="#999"
              value={businessName}
              onChangeText={setBusinessName}
              multiline={true}
              maxLength={100}
            />
            <Text style={styles.characterCount}>
              {getCharacterCount(businessName, 100)}
            </Text>
          </View>
        </View>

        {/* Business Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business type *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={{ color: businessType ? '#333' : '#999' }}>
              {businessType || 'Select business type'}
            </Text>
            <Text style={styles.dropdownArrow}>{dropdownVisible ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              {businessTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    index === businessTypes.length - 1 && styles.lastDropdownItem
                  ]}
                  onPress={() => {
                    setBusinessType(type);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={{ color: '#333' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Business Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business address *</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="4517 Washington Ave. Manchester, Kentucky 39495"
            placeholderTextColor="#999"
            value={businessAddress}
            onChangeText={setBusinessAddress}
            multiline={true}
          />
        </View>

        {/* Business Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Enter business description"
              placeholderTextColor="#999"
              value={businessDescription}
              onChangeText={setBusinessDescription}
              multiline={true}
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {getCharacterCount(businessDescription, 500)}
            </Text>
          </View>
        </View>

        {/* QR Link */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>QR Link</Text>
          <TextInput
            style={styles.input}
            placeholder="http://www.scantowall.com"
            placeholderTextColor="#999"
            value={qrLink}
            onChangeText={setQrLink}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
        
          style={[styles.continueButton, isSubmitting && styles.disabledButton]} 
          onPress={handleContinue}
          disabled={isSubmitting}
        >
          <Text style={styles.continueButtonText}>
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0C788D',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  headerRight: { width: 40 },
  content: { flex: 1, backgroundColor: '#f5f5f5' },
  inputContainer: { marginHorizontal: 16, marginTop: 16 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  addressInput: { height: 80, textAlignVertical: 'top' },
  textAreaContainer: { position: 'relative' },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: { position: 'absolute', bottom: 8, right: 16, fontSize: 12, color: '#999' },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#999',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 8,
    maxHeight: 200,
  },
  dropdownItem: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  continueButton: {
    backgroundColor: '#0C788D',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  bottomSpacer: { height: 32 },
});

export default EnterDetailsScreen;