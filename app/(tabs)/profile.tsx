import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [name, setName] = useState("Munni");
  const [email, setEmail] = useState("munni@student.csio.edu");
  const [department, setDepartment] = useState("CSIO");
  const [project, setProject] = useState("ISTC Smart Lab");
  const [role, setRole] = useState("Research Student");

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully");
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
          color: "#111827",
        }}
      >
        My Profile
      </Text>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 24,
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {/* Avatar */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "#2563EB",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person" size={48} color="white" />
          </View>

          <Text
            style={{
              marginTop: 12,
              fontSize: 22,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            {role}
          </Text>
        </View>

        {/* Inputs */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={inputStyle}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={inputStyle}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Department
        </Text>
        <TextInput
          value={department}
          onChangeText={setDepartment}
          style={inputStyle}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Project Name
        </Text>
        <TextInput
          value={project}
          onChangeText={setProject}
          style={inputStyle}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Role
        </Text>
        <TextInput
          value={role}
          onChangeText={setRole}
          style={inputStyle}
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: "#2563EB",
            padding: 16,
            borderRadius: 14,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Save Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const inputStyle = {
  backgroundColor: "#F9FAFB",
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#E5E7EB",
};