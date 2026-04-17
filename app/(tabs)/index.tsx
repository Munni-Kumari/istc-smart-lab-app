import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F4F7FB", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        ISTC Smart Lab
      </Text>

      <Text style={{ color: "#6B7280", marginTop: 6 }}>
        CSIO Research Dashboard
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/ai-chat")}
        style={{
          marginTop: 25,
          backgroundColor: "#2563EB",
          padding: 20,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          AI Assistant
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/create-experiment")}
        style={{
          marginTop: 15,
          backgroundColor: "#10B981",
          padding: 20,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Create Experiment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}