import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const OnCreateAccount = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please fill all the details...", ToastAndroid.LONG);
      return;
    }

    setIsLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      ToastAndroid.show("Please enter a valid email address.", ToastAndroid.LONG);
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      ToastAndroid.show("Password must be at least 6 characters.", ToastAndroid.LONG);
      setIsLoading(false);
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName.trim(),
        email: user.email,
        onboardingComplete: false,
        createdAt: new Date(),
      });

      router.replace("/(tabs)/one-time-form");
    } catch (error: any) {
      let message = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered.";
          break;
        case "auth/invalid-email":
          message = "The email address is badly formatted.";
          break;
        case "auth/weak-password":
          message = "Password is too weak.";
          break;
        default:
          message = "Error creating account. Please try again.";
      }
      ToastAndroid.show(message, ToastAndroid.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={OnCreateAccount}
        disabled={isLoading}
        style={styles.signUpWrapper}
      >
        <LinearGradient
          colors={["#008080", "#0D98BA"]}
          style={styles.signUpButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpText}>Create Account</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/auth/sign-in")}
        style={styles.loginWrapper}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>terms of service</Text> and{" "}
        <Text style={styles.link}>privacy policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 25, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", color: "#0D3B66", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 25 },
  inputWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 12, color: "#333" },
  eyeIcon: { padding: 5 },
  signUpWrapper: { borderRadius: 25, overflow: "hidden" },
  signUpButton: { paddingVertical: 15, borderRadius: 25, alignItems: "center" },
  signUpText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  loginWrapper: { alignItems: "center", marginVertical: 20 },
  loginText: { fontSize: 14, color: "#777" },
  loginLink: { color: "#008080", fontWeight: "600" },
  footerNote: { fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 10 },
  link: { color: "#008080" },
});
