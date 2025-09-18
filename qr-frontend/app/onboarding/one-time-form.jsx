import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/FirebaseConfig";

const BusinessForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    uniqueId: "",
    phone: "",
    email: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessDescription: "",
    qrLink: "",
  });

  useEffect(() => {
  if (auth.currentUser?.email) {
    setForm((prev) => ({ ...prev, email: auth.currentUser.email }));
  }
}, []);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        ToastAndroid.show("No user found. Please log in again.", ToastAndroid.LONG);
        return;
      }

  
      if (!form.fullName || !form.businessName || !form.businessType) {
        ToastAndroid.show("Please fill required fields.", ToastAndroid.LONG);
        return;
      }

      
      await setDoc(
        doc(db, "users", userId),
        {
          ...form,
          onboardingComplete: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      ToastAndroid.show("Onboarding complete!", ToastAndroid.SHORT);
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Error saving profile:", err);
      ToastAndroid.show("Error saving data. Try again.", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Your Business Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Unique ID"
        value={form.uniqueId}
        onChangeText={(text) => handleChange("uniqueId", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={(text) => handleChange("phone", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, { backgroundColor: "#f5f5f5" }]}
        placeholder="Email"
        value={form.email}
        editable={false} // lock since it's auto-filled from Auth
      />
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={form.businessName}
        onChangeText={(text) => handleChange("businessName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Type"
        value={form.businessType}
        onChangeText={(text) => handleChange("businessType", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Address"
        value={form.businessAddress}
        onChangeText={(text) => handleChange("businessAddress", text)}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Business Description"
        value={form.businessDescription}
        onChangeText={(text) => handleChange("businessDescription", text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="QR Link (optional)"
        value={form.qrLink}
        onChangeText={(text) => handleChange("qrLink", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessForm;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
