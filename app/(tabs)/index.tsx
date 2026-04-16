import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "#1F2937",
        }}
      >
        ISTC Smart Lab
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          marginTop: 6,
        }}
      >
        CSIO Research Dashboard
      </Text>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 25,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "48%",
            padding: 20,
            borderRadius: 18,
            elevation: 4,
          }}
        >
          <Text style={{ color: "#6B7280" }}>Experiments</Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 8,
              color: "#111827",
            }}
          >
            12
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "white",
            width: "48%",
            padding: 20,
            borderRadius: 18,
            elevation: 4,
          }}
        >
          <Text style={{ color: "#6B7280" }}>Devices</Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 8,
              color: "#111827",
            }}
          >
            5
          </Text>
        </View>
      </View>

      {/* Live Device Status */}
      <View
        style={{
          backgroundColor: "white",
          marginTop: 25,
          padding: 20,
          borderRadius: 18,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Live Status
        </Text>

        <Text style={{ marginTop: 12, color: "#10B981" }}>
          ● Sensor Node 1 Online
        </Text>

        <Text style={{ marginTop: 8, color: "#10B981" }}>
          ● Temperature Monitor Active
        </Text>

        <Text style={{ marginTop: 8, color: "#F59E0B" }}>
          ● AI Report Generation Running
        </Text>
      </View>

      {/* AI Assistant Card */}
      <TouchableOpacity
        onPress={() => router.push("/ai-chat")}
        style={{
          marginTop: 25,
          backgroundColor: "#2563EB",
          padding: 22,
          borderRadius: 18,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "white",
          }}
        >
          AI Assistant
        </Text>

        <Text
          style={{
            color: "white",
            marginTop: 8,
            fontSize: 15,
          }}
        >
          Generate summaries, experiment insights and reports
        </Text>
      </TouchableOpacity>

      {/* Create Experiment Button */}
      <TouchableOpacity
        onPress={() => router.push("/create-experiment")}
        style={{
          marginTop: 18,
          backgroundColor: "#10B981",
          padding: 18,
          borderRadius: 18,
          elevation: 4,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          + Create New Experiment
        </Text>
      </TouchableOpacity>

      {/* Recent Logs */}
      <View
        style={{
          backgroundColor: "white",
          marginTop: 25,
          padding: 20,
          borderRadius: 18,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Recent Logs
        </Text>

        <Text style={{ marginTop: 12, color: "#6B7280" }}>
          • Temperature experiment completed
        </Text>

        <Text style={{ marginTop: 8, color: "#6B7280" }}>
          • Humidity values updated
        </Text>

        <Text style={{ marginTop: 8, color: "#6B7280" }}>
          • AI generated lab summary
        </Text>
      </View>
    </ScrollView>
  );
}