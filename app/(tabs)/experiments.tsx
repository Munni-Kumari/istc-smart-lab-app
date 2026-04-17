import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { api } from "../../services/api";

export default function ExperimentsScreen() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadExperiments = async () => {
    try {
      setError("");
      console.log("Fetching experiments...");

      const data = await api.getExperiments();

      console.log("Experiments API Response:", data);

      if (Array.isArray(data)) {
        setExperiments(data);
      } else {
        setExperiments([]);
        setError("Invalid data format from backend");
      }
    } catch (err) {
      console.log("Experiments fetch error:", err);
      setError("Failed to load experiments");
      setExperiments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadExperiments();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F7FA",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading experiments...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        Experiments
      </Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      {experiments.length === 0 ? (
        <Text>No experiments found</Text>
      ) : (
        <FlatList
          data={experiments}
          keyExtractor={(item, index) =>
            item.uuid || item.id?.toString() || index.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/experiment-details",
                  params: {
                    id: item.id || item.uuid,
                    name: item.name,
                    description: item.description,
                  },
                })
              }
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {item.name || "Unnamed Experiment"}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#6B7280",
                }}
              >
                {item.description || "No description"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}