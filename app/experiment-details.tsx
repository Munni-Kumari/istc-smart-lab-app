import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ExperimentDetails() {
  const { id, name, description } = useLocalSearchParams();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B1220" }}>

      {/* HEADER */}
      <View style={{ padding: 20, paddingTop: 50 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
          {name}
        </Text>
        <Text style={{ color: "#9CA3AF", marginTop: 5 }}>
          Experiment ID: {id}
        </Text>
      </View>

      {/* CARD */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Description
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 10, lineHeight: 20 }}>
          {description}
        </Text>
      </View>

      {/* STATUS CARD (CSIO STYLE) */}
      <View
        style={{
          margin: 20,
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Live Status
        </Text>

        <Text style={{ color: "#10B981", marginTop: 10 }}>
          ● System Active
        </Text>
        <Text style={{ color: "#F59E0B", marginTop: 5 }}>
          ● Data Sync Running
        </Text>
        <Text style={{ color: "#3B82F6", marginTop: 5 }}>
          ● AI Module Ready
        </Text>
      </View>
    </ScrollView>
  );
}