import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { bookingsAPI, vehiclesAPI, servicesAPI, trackingAPI } from '../../src/services/api';
import { Booking, Vehicle, Service, VehicleStatus } from '../../src/types';
import { StatusTimeline, Button } from '../../src/components';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../src/utils/constants';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [statusHistory, setStatusHistory] = useState<VehicleStatus[]>([]);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    try {
      const bookingData = await bookingsAPI.getById(id);
      setBooking(bookingData);

      const [vehicleData, serviceData, trackingData] = await Promise.all([
        vehiclesAPI.getAll().then(vehicles => vehicles.find(v => v.vehicle_id === bookingData.vehicle_id)),
        servicesAPI.getAll().then(services => services.find(s => s.service_id === bookingData.service_id)),
        trackingAPI.getHistory(id),
      ]);

      setVehicle(vehicleData || null);
      setService(serviceData || null);
      setStatusHistory(trackingData);
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert('Errore', 'Impossibile caricare i dettagli');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annulla Prenotazione',
      'Sei sicuro di voler annullare questa prenotazione?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sì, annulla',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await bookingsAPI.cancel(id!);
              Alert.alert('Prenotazione Annullata', '', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Errore', 'Impossibile annullare la prenotazione');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Prenotazione non trovata</Text>
      </View>
    );
  }

  const currentStatus = statusHistory.length > 0 ? statusHistory[statusHistory.length - 1].status : 'waiting';
  const statusColor = STATUS_COLORS[currentStatus] || COLORS.secondary;
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor + '15' }]}>
          <View style={[styles.statusIcon, { backgroundColor: statusColor }]}>
            <Ionicons name="car" size={24} color={COLORS.white} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusLabel, { color: statusColor }]}>
              {STATUS_LABELS[currentStatus]}
            </Text>
            <Text style={styles.statusSubtext}>
              Stato prenotazione: {STATUS_LABELS[booking.status]}
            </Text>
          </View>
        </View>

        {/* Vehicle & Service Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dettagli</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="car" size={20} color={COLORS.primary} />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Veicolo</Text>
                <Text style={styles.detailValue}>
                  {vehicle?.marca} {vehicle?.modello}
                </Text>
                <Text style={styles.detailSubvalue}>{vehicle?.targa}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="construct" size={20} color={COLORS.primary} />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Servizio</Text>
                <Text style={styles.detailValue}>{service?.name}</Text>
                <Text style={styles.detailSubvalue}>{service?.description}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Appuntamento</Text>
                <Text style={styles.detailValue}>
                  {format(new Date(booking.scheduled_date), "EEEE d MMMM yyyy", { locale: it })}
                </Text>
                <Text style={styles.detailSubvalue}>
                  Ore {format(new Date(booking.scheduled_date), "HH:mm")}
                </Text>
              </View>
            </View>

            {booking.notes && (
              <View style={styles.detailRow}>
                <Ionicons name="document-text" size={20} color={COLORS.primary} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Note</Text>
                  <Text style={styles.detailValue}>{booking.notes}</Text>
                </View>
              </View>
            )}

            {booking.admin_notes && (
              <View style={styles.detailRow}>
                <Ionicons name="chatbubble" size={20} color={COLORS.warning} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Note Officina</Text>
                  <Text style={styles.detailValue}>{booking.admin_notes}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cronologia</Text>
          <View style={styles.timelineCard}>
            <StatusTimeline statuses={statusHistory} />
          </View>
        </View>

        {/* Actions */}
        {canCancel && (
          <View style={styles.actions}>
            <Button
              title="Annulla Prenotazione"
              onPress={handleCancel}
              variant="danger"
              loading={cancelling}
              fullWidth
              icon={<Ionicons name="close-circle" size={20} color={COLORS.white} />}
            />
          </View>
        )}
      </ScrollView>
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
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailSubvalue: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  actions: {
    marginTop: 8,
  },
});
