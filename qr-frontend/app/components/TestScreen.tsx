// app/components/TestScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../api/api";

export const TestScreen = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/users")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={{ padding: 16 }}>
      {data.map(user => (
        <Text key={user._id}>{user.name}</Text>
      ))}
    </View>
  );
};
