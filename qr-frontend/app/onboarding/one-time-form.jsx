import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
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

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await setDoc(doc(db, "users", userId), form);
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Details</Text>
      
      {Object.keys(form).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessForm;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10,
    borderRadius: 10, marginBottom: 15
  },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
