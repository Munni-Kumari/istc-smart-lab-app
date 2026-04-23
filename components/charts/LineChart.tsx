import React from "react";
import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface Props {
  values: number[];
  unit?: string;
}

export default function MyLineChart({ values = [], unit = "" }: Props) {
  if (!Array.isArray(values) || values.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "white" }}>
          Waiting for sensor data...
        </Text>
      </View>
    );
  }

  // Calculate min/max for better Y-axis scaling
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.1 || 10;

  // Create labels - show every 5th point to avoid crowding
  const labels = values.map((_, i) => {
    if (values.length > 10) {
      return i % 5 === 0 ? `${i + 1}` : "";
    }
    return `${i + 1}`;
  });

  const displayUnit = unit || "";

  return (
    <View style={{ marginTop: 20 }}>
      {/* Current Value Display */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Current Reading</Text>
        <Text style={{ color: "#10B981", fontSize: 28, fontWeight: "bold" }}>
          {values[values.length - 1].toFixed(1)}{displayUnit}
        </Text>
      </View>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values.map((v) => Number(v) || 0),
            },
          ],
        }}
        width={screenWidth - 60}
        height={200}
        yAxisSuffix={displayUnit}
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "#111827",
          backgroundGradientTo: "#111827",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "3",
            strokeWidth: 1,
            stroke: "#10B981",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#374151",
            strokeWidth: 0.5,
          },
        }}
        bezier
        style={{
          borderRadius: 12,
        }}
        fromZero={false}
        segments={4}
      />

      {/* Stats */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 10 }}>MIN</Text>
          <Text style={{ color: "white", fontSize: 12 }}>{minVal.toFixed(1)}{displayUnit}</Text>
        </View>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 10 }}>MAX</Text>
          <Text style={{ color: "white", fontSize: 12 }}>{maxVal.toFixed(1)}{displayUnit}</Text>
        </View>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 10 }}>AVG</Text>
          <Text style={{ color: "white", fontSize: 12 }}>
            {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}{displayUnit}
          </Text>
        </View>
      </View>
    </View>
  );
}