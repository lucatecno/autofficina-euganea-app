import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { COLORS } from '../src/utils/constants';
import { Button } from '../src/components';

export default function LoginScreen() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="construct" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>AUTOFFICINA</Text>
          <Text style={styles.subtitle}>EUGANEA</Text>
          <Text style={styles.tagline}>La tua officina di fiducia</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
            <Text style={styles.featureText}>Prenota appuntamenti</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="locate-outline" size={24} color={COLORS.primary} />
            <Text style={styles.featureText}>Traccia il tuo veicolo</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            <Text style={styles.featureText}>Ricevi aggiornamenti</Text>
          </View>
        </View>

        {/* Login Button */}
        <View style={styles.loginSection}>
          <TouchableOpacity style={styles.googleButton} onPress={login}>
            <Ionicons name="logo-google" size={24} color={COLORS.white} />
            <Text style={styles.googleButtonText}>Accedi con Google</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Accedendo, accetti i nostri Termini di Servizio e la Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  features: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text,
  },
  loginSection: {
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
