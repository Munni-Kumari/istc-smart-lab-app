import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import MyLineChart from "../../components/charts/LineChart";

export default function ExperimentScreen() {
  const { id } = useLocalSearchParams();

  const [experiment, setExperiment] = useState<any>(null);
  const [graphValues, setGraphValues] = useState<number[]>([]);

  useEffect(() => {
    fetchExperiment();
    fetchGraphData();

    const interval = setInterval(fetchGraphData, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchExperiment = async () => {
    try {
      const res = await fetch(
        `http://192.168.221.66:3000/api/experiments/${id}`
      );

      const data = await res.json();
      setExperiment(data);
    } catch (error) {
      console.log("Experiment fetch error:", error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const res = await fetch(
        "http://192.168.221.66:3000/api/live-update"
      );

      const data = await res.json();

      setGraphValues(data.values || []);
    } catch (error) {
      console.log("Graph fetch error:", error);
    }
  };

  if (!experiment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{experiment.name}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>
          {experiment.description}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Components</Text>
        <Text style={styles.text}>
          {experiment.components}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Live Data</Text>
        <MyLineChart values={graphValues} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>AI Assistant</Text>
        <Text style={styles.text}>
          Ask anything about this experiment
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020d2b",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#020d2b",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#0b1736",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  text: {
    color: "#cfd8dc",
    fontSize: 16,
  },
});