import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { COLORS } from '../../src/utils/constants';
import { Button } from '../../src/components';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.iubenda.com/privacy-policy/example');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/vehicles')}>
            <View style={styles.menuIcon}>
              <Ionicons name="car" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>I Miei Veicoli</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/bookings')}>
            <View style={styles.menuIcon}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Le Mie Prenotazioni</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni</Text>

          <TouchableOpacity style={styles.menuItem} onPress={openPrivacyPolicy}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('tel:+390491234567')}>
            <View style={styles.menuIcon}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Contattaci</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* GDPR Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consensi GDPR</Text>
          <View style={styles.gdprCard}>
            <View style={styles.gdprRow}>
              <Text style={styles.gdprLabel}>Trattamento dati</Text>
              <Ionicons
                name={user?.gdpr_accepted ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={user?.gdpr_accepted ? COLORS.success : COLORS.error}
              />
            </View>
            <View style={styles.gdprRow}>
              <Text style={styles.gdprLabel}>Marketing</Text>
              <Ionicons
                name={user?.marketing_accepted ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={user?.marketing_accepted ? COLORS.success : COLORS.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Esci"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            icon={<Ionicons name="log-out-outline" size={20} color={COLORS.primary} />}
          />
        </View>

        <Text style={styles.version}>Versione 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  gdprCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  gdprRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  gdprLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
