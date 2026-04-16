import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { api } from "../services/api";
import { router } from "expo-router";

export default function CreateExperimentScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState("");
  const [dataValues, setDataValues] = useState("");

  const handleCreate = async () => {
    try {
      const res = await api.createExperiment({
        name,
        description,
        components,
        dataValues,
      });

      console.log("Created:", res);

      router.push("/(tabs)/experiments");
    } catch (error) {
      console.log("Create error:", error);
    }
  };

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
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Create Experiment
      </Text>

      <TextInput
        placeholder="Experiment Name"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Components"
        value={components}
        onChangeText={setComponents}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Data Values"
        value={dataValues}
        onChangeText={setDataValues}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleCreate}
        style={{
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          Create Experiment
        </Text>
      </TouchableOpacity>
    </View>
  );
}