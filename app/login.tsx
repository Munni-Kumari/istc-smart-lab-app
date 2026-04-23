import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const handleLogin = () => {
    // Basic validation
    if (email && password) {
      login('fake-token');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset instructions have been sent to your email.');
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registration is currently invite-only. Please contact your lab administrator.');
  };

  const themeColors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <ThemedText type="title" style={styles.title}>ISTC Smart Lab</ThemedText>
            <ThemedText style={styles.subtitle}>Welcome back! Please login to continue.</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f2f2f7' }]}>
              <Ionicons name="mail-outline" size={20} color={themeColors.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Email"
                placeholderTextColor={themeColors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f2f2f7' }]}>
              <Ionicons name="lock-closed-outline" size={20} color={themeColors.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Password"
                placeholderTextColor={themeColors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={themeColors.icon} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: themeColors.tint }]} 
              onPress={handleLogin}
            >
              <Text style={[styles.loginButtonText, { color: colorScheme === 'dark' ? '#000' : '#fff' }]}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText>Don&apos;t have an account? </ThemedText>
              <TouchableOpacity onPress={handleSignUp}>
                <ThemedText style={{ color: themeColors.tint, fontWeight: '600' }}>Sign Up</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    opacity: 0.8,
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
