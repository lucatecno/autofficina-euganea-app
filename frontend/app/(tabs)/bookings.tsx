import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { bookingsAPI, vehiclesAPI, servicesAPI, trackingAPI } from '../../src/services/api';
import { Booking, Vehicle, Service } from '../../src/types';
import { BookingCard, Button } from '../../src/components';
import { COLORS } from '../../src/utils/constants';

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentStatuses, setCurrentStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const loadData = async () => {
    try {
      const [bookingsData, vehiclesData, servicesData] = await Promise.all([
        bookingsAPI.getAll(),
        vehiclesAPI.getAll(),
        servicesAPI.getAll(),
      ]);

      setBookings(bookingsData);
      setVehicles(vehiclesData);
      setServices(servicesData);

      // Get current status for each booking
      const statuses: Record<string, string> = {};
      for (const booking of bookingsData) {
        try {
          const status = await trackingAPI.getCurrent(booking.booking_id);
          if (status) {
            statuses[booking.booking_id] = status.status;
          }
        } catch (e) {
          // Ignore errors for individual status fetches
        }
      }
      setCurrentStatuses(statuses);
    } catch (error) {
      console.error('Error loading bookings:', error);
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

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return ['pending', 'confirmed'].includes(b.status);
    if (filter === 'completed') return ['completed', 'cancelled'].includes(b.status);
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tutte' : f === 'active' ? 'Attive' : 'Completate'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nessuna prenotazione</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'active'
                ? 'Non hai prenotazioni attive'
                : filter === 'completed'
                ? 'Non hai prenotazioni completate'
                : 'Inizia prenotando il tuo primo intervento'}
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.booking_id}
              booking={booking}
              vehicle={vehicles.find((v) => v.vehicle_id === booking.vehicle_id)}
              service={services.find((s) => s.service_id === booking.service_id)}
              currentStatus={currentStatuses[booking.booking_id]}
              onPress={() => router.push(`/booking/${booking.booking_id}`)}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/booking/new')}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.background,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
