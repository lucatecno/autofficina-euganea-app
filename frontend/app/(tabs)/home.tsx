import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { bookingsAPI, vehiclesAPI, servicesAPI, trackingAPI } from '../../src/services/api';
import { Booking, Vehicle, Service, VehicleStatus } from '../../src/types';
import { BookingCard } from '../../src/components';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../src/utils/constants';

// Contact info
const WHATSAPP_NUMBER = '393203145049';
const PHONE_NUMBER = '+393203145049';
const EMAIL = 'autofficinaeuganea@libero.it';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [currentStatus, setCurrentStatus] = useState<VehicleStatus | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [bookingsData, vehiclesData, servicesData] = await Promise.all([
        bookingsAPI.getAll(),
        vehiclesAPI.getAll(),
        servicesAPI.getAll(),
      ]);

      setVehicles(vehiclesData);
      setServices(servicesData);

      // Find active booking (not completed/cancelled)
      const active = bookingsData.find(
        (b) => ['pending', 'confirmed'].includes(b.status)
      );

      if (active) {
        setActiveBooking(active);
        const vehicle = vehiclesData.find((v) => v.vehicle_id === active.vehicle_id);
        const service = servicesData.find((s) => s.service_id === active.service_id);
        setActiveVehicle(vehicle || null);
        setActiveService(service || null);

        // Get current tracking status
        const status = await trackingAPI.getCurrent(active.booking_id);
        setCurrentStatus(status);
      } else {
        setActiveBooking(null);
        setActiveVehicle(null);
        setActiveService(null);
        setCurrentStatus(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Ciao, {user?.name?.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>Benvenuto in Autofficina Euganea</Text>
        </View>

        {/* Active Booking Status */}
        {activeBooking ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stato Veicolo</Text>
            <TouchableOpacity
              style={styles.statusCard}
              onPress={() => router.push(`/booking/${activeBooking.booking_id}`)}
            >
              <View style={styles.statusHeader}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_COLORS[currentStatus?.status || 'waiting'] + '20' }
                ]}>
                  <Ionicons
                    name="car"
                    size={24}
                    color={STATUS_COLORS[currentStatus?.status || 'waiting']}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>
                    {STATUS_LABELS[currentStatus?.status || 'waiting']}
                  </Text>
                  <Text style={styles.statusVehicle}>
                    {activeVehicle?.marca} {activeVehicle?.modello}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: getProgressWidth(currentStatus?.status),
                      backgroundColor: STATUS_COLORS[currentStatus?.status || 'waiting'],
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>In attesa</Text>
                <Text style={styles.progressLabel}>In lavorazione</Text>
                <Text style={styles.progressLabel}>Pronto</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.noBookingCard}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.noBookingText}>Nessuna prenotazione attiva</Text>
              <Text style={styles.noBookingSubtext}>
                Prenota il tuo prossimo intervento
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azioni Rapide</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/booking/new')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="add-circle" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Prenota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Ionicons name="list" size={28} color={COLORS.info} />
              </View>
              <Text style={styles.actionText}>Storico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/vehicles')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Ionicons name="car" size={28} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Veicoli</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/showcase')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="images" size={28} color={COLORS.warning} />
              </View>
              <Text style={styles.actionText}>Lavori</Text>
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/manuale')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#9b59b6' + '20' }]}>
                  <Ionicons name="book" size={28} color="#9b59b6" />
                </View>
                <Text style={styles.actionText}>Guida</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* WhatsApp Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Ciao! Vorrei informazioni sui vostri servizi.`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
            <Text style={styles.whatsappText}>Contattaci su WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Via Galzignanese 14/A, Battaglia Terme (PD)</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Lun-Ven: 8:00 - 19:00 | Sab: 8:00 - 12:00</Text>
            </View>
            <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${PHONE_NUMBER}`)}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={[styles.infoText, { color: COLORS.primary }]}>+39 320 314 5049</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>
              <Ionicons name="mail" size={20} color={COLORS.primary} />
              <Text style={[styles.infoText, { color: COLORS.primary }]}>{EMAIL}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getProgressWidth(status?: string): string {
  switch (status) {
    case 'waiting': return '10%';
    case 'checked_in': return '25%';
    case 'in_progress': return '50%';
    case 'testing': return '75%';
    case 'ready': return '90%';
    case 'delivered': return '100%';
    default: return '0%';
  }
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusVehicle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  noBookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  noBookingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  noBookingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  whatsappText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
