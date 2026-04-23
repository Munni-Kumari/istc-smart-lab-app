import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";

export default function ExperimentsScreen() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    loadExperiments();
  };

  const loadExperiments = async () => {
    try {
      setError("");
      const data = await api.getExperiments();
      if (Array.isArray(data)) {
        setExperiments(data);
      } else {
        setExperiments([]);
        setError("Invalid data format from backend");
      }
    } catch (err) {
      setError("Failed to load experiments");
      setExperiments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExperiments();
    }, [])
  );


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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          Experiments
        </Text>
        <TouchableOpacity 
          onPress={() => router.push("/create-experiment")}
          style={{ backgroundColor: '#2563EB', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      {experiments.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="flask-outline" size={64} color="#CBD5E1" />
          <Text style={{ fontSize: 18, color: '#64748B', marginTop: 16 }}>No experiments found</Text>
          <TouchableOpacity 
            onPress={loadExperiments}
            style={{ marginTop: 20, backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Retry Fetch</Text>
          </TouchableOpacity>
        </View>
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