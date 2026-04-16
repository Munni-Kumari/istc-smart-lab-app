import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        ISTC Smart Lab
      </Text>

      <Text style={{ marginTop: 10 }}>
        Welcome to your dashboard
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/ai-chat")}
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "black",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>
          Open AI Assistant
        </Text>
      </TouchableOpacity>
    </View>
  );
}