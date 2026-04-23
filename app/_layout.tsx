import React, { useEffect } from "react";
import { Stack, router, usePathname, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = pathname === "/login";

    const timer = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/login" as any);
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/" as any);
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname, navigationState?.key]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ai-chat" options={{ headerShown: true, title: "AI Assistant" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}