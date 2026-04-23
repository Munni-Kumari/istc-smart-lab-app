import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MyLineChart from "../components/charts/LineChart";
import { mqttService } from "../services/mqttService";
import { api } from "../services/api";

export default function ExperimentDetails() {
  const { id, name, description } = useLocalSearchParams();

  const [graphValues, setGraphValues] = useState<number[]>([]);
  const [currentUnit, setCurrentUnit] = useState("");
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [deviceConnected, setDeviceConnected] = useState(false);

  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    console.log("🔌 Connecting to MQTT broker...");
    mqttService.connect();
    setIsLiveConnected(true);

    const unsubscribe = mqttService.subscribe((data) => {
      console.log(
        "📊 Live sensor data:",
        data.values,
        "| Device:",
        data.deviceConnected
      );

      setGraphValues(data.values);
      setDeviceConnected(data.deviceConnected);
      if (data.unit) setCurrentUnit(data.unit);
    });

    return () => {
      unsubscribe();
      mqttService.disconnect();
      setIsLiveConnected(false);
    };
  }, []);

  const handleToggleFetch = () => {
    if (isFetching) {
      mqttService.pause();
      setIsFetching(false);
    } else {
      mqttService.resume();
      setIsFetching(true);
    }
  };

  const handleClearData = () => {
    mqttService.clearData();
    setGraphValues([]);
  };

  const handleAskAI = async () => {
    try {
      if (!aiMessage.trim()) return;

      setAiLoading(true);

      const payload = {
        message: aiMessage,
        experiment: {
          id,
          name,
          description,
          components: "ESP8266 + Ultrasonic Sensor",
          dataValues: graphValues,
        },
        history: chatHistory,
      };

      const data = await api.askAI(payload);

      setAiResponse(data.result);

      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: aiMessage },
        { role: "ai", text: data.result },
      ]);

      setAiMessage("");
    } catch (error) {
      console.log("AI error:", error);
      setAiResponse("AI connection failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B1220" }}>
      {/* HEADER */}
      <View style={{ padding: 20, paddingTop: 50 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {name || "Lab Experiment"}
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 5 }}>
          Experiment ID: {id || "N/A"}
        </Text>
      </View>

      {/* DESCRIPTION */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Description
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 10,
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      </View>

      {/* LIVE GRAPH */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Live Sensor Graph
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={handleToggleFetch}
              style={{
                backgroundColor: isFetching
                  ? "#EF4444"
                  : "#10B981",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                minWidth: 70,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {isFetching ? "⏹ Stop" : "▶ Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearData}
              style={{
                backgroundColor: "#6B7280",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 10,
                minWidth: 70,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                🗑 Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {graphValues.length > 0 && deviceConnected ? (
          <MyLineChart values={graphValues} unit={currentUnit} />
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 14, textAlign: 'center' }}>
              {isFetching
                ? `🔌 Searching for lab data at 192.168.221.66...\nEnsure your ESP8266 is publishing to 'smartlab/sensor/data'`
                : "Data fetching stopped"}
            </Text>

            <View style={{ marginTop: 20, backgroundColor: '#1F2937', padding: 12, borderRadius: 10, width: '100%' }}>
              <Text style={{ color: '#6B7280', fontSize: 11, marginBottom: 4 }}>DEBUG INFO</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 11 }}>● Server: http://192.168.221.66:3000</Text>
              <Text style={{ color: deviceConnected ? '#10B981' : '#F59E0B', fontSize: 11 }}>
                ● Device: {deviceConnected ? "CONNECTED" : "WAITING FOR DATA..."}
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 11 }}>● Buffer: {graphValues.length} points</Text>
            </View>
          </View>
        )}
      </View>

      {/* STATUS */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Connection Status
        </Text>

        <Text
          style={{
            color: isLiveConnected
              ? "#10B981"
              : "#EF4444",
            marginTop: 10,
          }}
        >
          {isLiveConnected
            ? "● Server Connected"
            : "● Disconnected"}
        </Text>

        <Text
          style={{
            color: deviceConnected
              ? "#10B981"
              : "#F59E0B",
            marginTop: 5,
          }}
        >
          {deviceConnected
            ? "● ESP8266 Device Connected"
            : "● Waiting for Device..."}
        </Text>

        <Text
          style={{
            color: "#3B82F6",
            marginTop: 5,
          }}
        >
          {isFetching
            ? "● Data Stream Active"
            : "● Data Stream Paused"}
        </Text>
      </View>

      {/* AI ASSISTANT */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 15,
            fontSize: 16,
          }}
        >
          AI Assistant
        </Text>

        <TextInput
          value={aiMessage}
          onChangeText={setAiMessage}
          placeholder="Ask about this experiment..."
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: "#1F2937",
            color: "white",
            padding: 14,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={handleAskAI}
          style={{
            backgroundColor: "#2563EB",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            {aiLoading ? "Thinking..." : "Ask AI"}
          </Text>
        </TouchableOpacity>

        {aiResponse ? (
          <View
            style={{
              marginTop: 15,
              backgroundColor: "#1F2937",
              padding: 15,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#D1D5DB",
                lineHeight: 22,
              }}
            >
              {aiResponse}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}