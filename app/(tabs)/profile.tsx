import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/services/api";

type ActiveView = 'main' | 'personal' | 'directory' | 'add';

export default function ProfileScreen() {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  
  // Current user state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [role, setRole] = useState("");

  // New member form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Research Student");
  const [newDept, setNewDept] = useState("CSIO");

  const [labMembers, setLabMembers] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = isDarkMode;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const user = await api.getProfile('1');
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDepartment(user.department);
      setProject(user.project);
      setRole(user.role);
    }
    const data = await api.getProfiles();
    setLabMembers(data);
    setIsDarkMode(colorScheme === 'dark');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile('1', { name, email, department, project, role });
      Alert.alert("Success", "Profile updated successfully.");
      setActiveView('main');
      const data = await api.getProfiles();
      setLabMembers(data);
    } catch {
      Alert.alert("Error", "Could not sync with server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newName.trim()) return Alert.alert("Error", "Please enter a name.");
    setIsSaving(true);
    try {
      await api.addProfile({ name: newName, role: newRole, department: newDept });
      Alert.alert("Success", "New member added to directory.");
      setNewName(""); // Clear form
      setActiveView('directory');
      const data = await api.getProfiles();
      setLabMembers(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string, memberName: string) => {
    Alert.alert(
      "Delete Profile",
      `Are you sure you want to remove ${memberName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await api.deleteProfile(id);
            const data = await api.getProfiles();
            setLabMembers(data);
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, title, value, onPress, color = "#2563EB", isSwitch = false, switchValue = false, onSwitchChange = () => {} }: any) => (
    <TouchableOpacity 
      style={[styles.item, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]} 
      onPress={isSwitch ? undefined : onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{title}</ThemedText>
        {value && <ThemedText style={styles.itemValue}>{value}</ThemedText>}
      </View>
      {isSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange}
          trackColor={{ false: "#767577", true: "#3B82F6" }}
          thumbColor={Platform.OS === 'ios' ? undefined : (switchValue ? "#fff" : "#f4f3f4")}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );

  const renderPersonal = () => (
    <View style={styles.subView}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setActiveView('main')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.subTitle}>Personal Info</ThemedText>
      </View>
      
      <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput value={name} onChangeText={setName} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email Address</ThemedText>
          <TextInput value={email} onChangeText={setEmail} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Department</ThemedText>
          <TextInput value={department} onChangeText={setDepartment} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { flex: 1 }]} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Update My Profile</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={async () => {
              setIsSaving(true);
              try {
                await api.addProfile({ name, role: 'Research Student', department });
                Alert.alert("Success", `Added ${name} as a new lab member.`);
                const data = await api.getProfiles();
                setLabMembers(data);
                setActiveView('directory');
              } finally {
                setIsSaving(false);
              }
            }} 
            style={[styles.saveButton, { flex: 1, backgroundColor: '#10B981' }]} 
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Add as New Member</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAddMember = () => (
    <View style={styles.subView}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setActiveView('directory')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.subTitle}>Add Member</ThemedText>
      </View>
      
      <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Member Name</ThemedText>
          <TextInput placeholder="Enter full name" placeholderTextColor="#94A3B8" value={newName} onChangeText={setNewName} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Role</ThemedText>
          <TextInput value={newRole} onChangeText={setNewRole} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Department</ThemedText>
          <TextInput value={newDept} onChangeText={setNewDept} style={[styles.input, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#333' : '#E5E7EB' }]} />
        </View>
        
        <TouchableOpacity onPress={handleAddMember} style={styles.saveButton} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Add to Directory</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDirectory = () => (
    <View style={styles.subView}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setActiveView('main')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.subTitle}>Lab Directory</ThemedText>
        <TouchableOpacity onPress={() => setActiveView('add')} style={styles.addIconButton}>
          <Ionicons name="person-add" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {labMembers.map((member, index) => (
        <View key={member.id || index} style={[styles.memberCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.memberAvatar}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{member.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={{ fontWeight: 'bold' }}>{member.name}</ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#6B7280' }}>{member.role} • {member.department}</ThemedText>
          </View>
          {member.id !== '1' && (
            <TouchableOpacity onPress={() => handleDelete(member.id, member.name)} style={styles.deleteIconButton}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  if (activeView === 'personal') return <ThemedView style={styles.container}><ScrollView>{renderPersonal()}</ScrollView></ThemedView>;
  if (activeView === 'directory') return <ThemedView style={styles.container}><ScrollView>{renderDirectory()}</ScrollView></ThemedView>;
  if (activeView === 'add') return <ThemedView style={styles.container}><ScrollView>{renderAddMember()}</ScrollView></ThemedView>;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}><Ionicons name="person" size={50} color="white" /></View>
            <View style={styles.cameraBadge}><Ionicons name="camera" size={16} color="white" /></View>
          </View>
          <ThemedText type="title" style={styles.userName}>{name}</ThemedText>
          <ThemedText style={styles.userRole}>{role}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>Account Settings</ThemedText>
          <ProfileItem icon="person-outline" title="Personal Information" value="Name, Email, Department" onPress={() => setActiveView('personal')} />
          <ProfileItem icon="people-outline" title="Lab Directory" value={`${labMembers.length} Members`} color="#3B82F6" onPress={() => setActiveView('directory')} />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>App Settings</ThemedText>
          <ProfileItem icon="moon-outline" title="Dark Mode" isSwitch={true} switchValue={isDarkMode} onSwitchChange={setIsDarkMode} color="#8B5CF6" />
          <ProfileItem icon="notifications-outline" title="Push Notifications" isSwitch={true} switchValue={notifications} onSwitchChange={setNotifications} color="#F59E0B" />
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutRow} onPress={logout}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}><Ionicons name="log-out-outline" size={22} color="#EF4444" /></View>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10B981', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 24, fontWeight: 'bold' },
  userRole: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, elevation: 2 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemTextContainer: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemValue: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  logoutRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { marginLeft: 15, fontSize: 16, fontWeight: '600', color: '#EF4444' },
  subView: { padding: 20 },
  subHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backButton: { marginRight: 15 },
  subTitle: { fontSize: 24, fontWeight: 'bold' },
  card: { padding: 20, borderRadius: 16, elevation: 3 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 8 },
  input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 8 },
  saveButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  memberCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 10, elevation: 1 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  deleteIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  addIconButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  }
});