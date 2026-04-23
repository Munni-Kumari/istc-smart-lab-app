import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Ensure this is installed or use View with fallback

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const StatCard = ({ icon, label, value, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const ActionButton = ({ icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[styles.actionButton, { backgroundColor: color }]}
    >
      <View style={styles.actionIconCircle}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PREMIUM HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.userNameText}>Munni Kumari</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={() => router.push("/(tabs)/profile")}>
          <Image 
            source={{ uri: "https://ui-avatars.com/api/?name=Munni+Kumari&background=2563EB&color=fff" }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      {/* LAB STATUS CARD */}
      <View style={styles.statusBanner}>
        <View style={styles.statusContent}>
          <View style={styles.statusIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>Lab System Online</Text>
          </View>
          <Text style={styles.bannerTitle}>CSIO Research Hub</Text>
          <Text style={styles.bannerSubtitle}>Advanced Instrumentation & Smart Lab Control</Text>
        </View>
        <Ionicons name="shield-checkmark" size={60} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
      </View>

      {/* STATS GRID */}
      <View style={styles.statsGrid}>
        <StatCard icon="flask" label="Active" value="12" color="#2563EB" />
        <StatCard icon="people" label="Members" value="48" color="#8B5CF6" />
        <StatCard icon="pulse" label="Uptime" value="99.9%" color="#10B981" />
      </View>

      {/* PRIMARY ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Quick Access</Text>
        <ActionButton 
          icon="sparkles" 
          title="AI Lab Assistant" 
          subtitle="Smart research & data analysis" 
          color="#2563EB"
          onPress={() => router.push("/ai-chat")}
        />
        <ActionButton 
          icon="add-circle" 
          title="New Experiment" 
          subtitle="Setup sensors & monitoring" 
          color="#10B981"
          onPress={() => router.push("/create-experiment")}
        />
        <ActionButton 
          icon="analytics" 
          title="Global Directory" 
          subtitle="Connect with CSIO researchers" 
          color="#8B5CF6"
          onPress={() => router.push("/(tabs)/profile")}
        />
      </View>

      {/* RECENT UPDATES placeholder */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Recent Updates</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/experiments")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="notifications" size={18} color="#2563EB" />
          </View>
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>New Data Recorded</Text>
            <Text style={styles.activityTime}>Water Quality Analysis • 5m ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileBadge: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBanner: {
    margin: 20,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statusContent: {
    zIndex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  bannerIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    width: (width - 60) / 3,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  }
});