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
    if (!message.trim()) return;

    setLoading(true);

    const data = await api.askAI(message);

    setReply(data?.result || "No response received");

    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Ask AI..."
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
        }}
      >
        <Text style={{ color: "white" }}>
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