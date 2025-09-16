import React from "react";
import { View, Text } from "react-native";
import { TestScreen } from "../components/TestScreen";

export default function HomeScreen() {
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", margin: 16,color:"white" }}>
        Home Screen
      </Text>
      <TestScreen />
    </View>
  );
}
