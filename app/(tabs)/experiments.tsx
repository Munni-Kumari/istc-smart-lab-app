import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { fetchExperiments } from "../../services/api";

export default function ExperimentsScreen() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExperiments = async () => {
    try {
      const data = await fetchExperiments();
      setExperiments(data);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Experiments
      </Text>

      <FlatList
        data={experiments}
        keyExtractor={(item: any) => item.uuid}
        renderItem={({ item }: any) => (
          <View
            style={{
              padding: 15,
              borderWidth: 1,
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.name}
            </Text>

            <Text style={{ marginTop: 5 }}>
              {item.description}
            </Text>
          </View>
        )}
      />
    </View>
  );
}