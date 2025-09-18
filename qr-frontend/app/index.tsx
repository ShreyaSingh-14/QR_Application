import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AuthScreen from "../components/LoginScreen";
import { auth } from "./../config/FirebaseConfig"; 
import type { User } from "firebase/auth";            
import { onAuthStateChanged } from "firebase/auth";   
import { Redirect } from "expo-router";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSplashFinish = () => setShowSplash(false);

  if (loading) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  return <View style={{ flex: 1 }}>{user ? <Redirect href="/home" /> : <Redirect href="/auth/sign-in"/>}</View>;
}
