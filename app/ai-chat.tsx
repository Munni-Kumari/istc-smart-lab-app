import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function AIChatScreen() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your ISTC Lab Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>();

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await api.askAI({ message: userMessage, history: chatHistory });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.result }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the lab server." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatHistory.map((chat, index) => (
          <View 
            key={index} 
            style={[
              styles.messageBubble,
              chat.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            <View style={styles.bubbleHeader}>
              <Ionicons 
                name={chat.role === 'user' ? "person-circle" : "sparkles"} 
                size={16} 
                color={chat.role === 'user' ? "#3B82F6" : "#10B981"} 
              />
              <Text style={[styles.roleText, { color: chat.role === 'user' ? "#3B82F6" : "#10B981" }]}>
                {chat.role === 'user' ? "You" : "Lab AI"}
              </Text>
            </View>
            <Text style={styles.messageText}>{chat.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <ActivityIndicator size="small" color="#10B981" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask anything about the lab..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
          multiline
          style={styles.input}
        />
        <TouchableOpacity 
          onPress={handleSend}
          disabled={loading || !message.trim()}
          style={[styles.sendButton, (!message.trim() || loading) && styles.disabledButton]}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    maxWidth: '85%',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#EFF6FF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 15,
    color: '#1E293B',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  }
});