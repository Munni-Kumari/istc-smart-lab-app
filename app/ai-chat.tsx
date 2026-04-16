import { View, TextInput, Button, Text } from "react-native";
import { useState } from "react";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = () => {
    setReply("AI response will come here");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Ask AI..."
        value={message}
        onChangeText={setMessage}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Button title="Send" onPress={handleSend} />

      <Text style={{ marginTop: 20 }}>
        {reply}
      </Text>
    </View>
  );
}