import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { api } from "../services/api";

export default function AIChatScreen() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask something...");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    try {
      setLoading(true);

      const data = await api.askAI(message);

      setReply(data.result || "No AI response received");
    } catch (error) {
      setReply("Error connecting to AI backend");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        AI Assistant
      </Text>

      <TextInput
        placeholder="Ask AI about experiments..."
        value={message}
        onChangeText={setMessage}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 12,
        }}
      />

      <TouchableOpacity
        onPress={sendMessage}
        style={{
          marginTop: 20,
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading ? "Loading..." : "Send"}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 20,
          backgroundColor: "white",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text>{reply}</Text>
      </View>
    </ScrollView>
  );
}