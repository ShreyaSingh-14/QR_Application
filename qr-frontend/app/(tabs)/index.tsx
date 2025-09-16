// app/index.tsx
import React from "react";
import { SafeAreaView } from "react-native";
import LoginScreen from "../components/LoginScreen";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginScreen />
    </SafeAreaView>
  );
}
