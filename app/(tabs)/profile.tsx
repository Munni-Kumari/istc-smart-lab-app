import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 18,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
          }}
        >
          Research Profile
        </Text>

        <Text style={{ marginTop: 16 }}>Name: Student</Text>
        <Text style={{ marginTop: 10 }}>Department: CSIO</Text>
        <Text style={{ marginTop: 10 }}>Project: ISTC Smart Lab</Text>
      </View>
    </View>
  );
}