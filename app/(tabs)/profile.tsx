import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>
        User Profile
      </Text>

      <Text style={{ marginTop: 10 }}>
        Name: Student
      </Text>
    </View>
  );
}