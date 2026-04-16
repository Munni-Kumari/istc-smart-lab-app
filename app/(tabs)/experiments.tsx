import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function ExperimentsScreen() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const data = await api.getExperiments();
      setExperiments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading experiments...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Experiments
      </Text>

      <FlatList
        data={experiments}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 18,
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.name}
            </Text>

            <Text style={{ marginTop: 8 }}>
              {item.description}
            </Text>
          </View>
        )}
      />
    </View>
  );
}