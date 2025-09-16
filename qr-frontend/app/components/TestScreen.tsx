import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../api/api";

export const TestScreen = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/users")
      .then(res => {
        console.log("📡 API Response:", res.data); // Debugging
        setData(res.data);
      })
      .catch(err => console.error("❌ API Error:", err));
  }, []);

  return (
    <View style={{ padding: 16,backgroundColor: "#f5f5f5", flex: 1  }}>
      {data.length > 0 ? (
        data.map(user => (
          <Text key={user._id}>{user.name}</Text>
        ))
      ) : (
        <Text>Loading users...</Text>
      )}
    </View>
  );
};
