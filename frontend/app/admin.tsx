import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { adminAPI } from '../src/services/api';
import { EnrichedBooking } from '../src/types';
import { Button } from '../src/components';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../src/utils/constants';

const VEHICLE_STATUSES = [
  { value: 'waiting', label: 'In attesa' },
  { value: 'checked_in', label: 'Check-in' },
  { value: 'in_progress', label: 'In lavorazione' },
  { value: 'testing', label: 'Collaudo' },
  { value: 'ready', label: 'Pronto' },
  { value: 'delivered', label: 'Consegnato' },
];

export default function AdminScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<EnrichedBooking | null>(null);
  const [filter, setFilter] = useState<'today' | 'pending' | 'all'>('today');

  const loadBookings = async () => {
    try {
      let status: string | undefined;
      let date: string | undefined;
      
      if (filter === 'today') {
        date = format(new Date(), 'yyyy-MM-dd');
      } else if (filter === 'pending') {
        status = 'confirmed';
      }

      const data = await adminAPI.getAllBookings(status, date);
      setBookings(data);
    } catch (error) {
      console.error('Error loading admin bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await adminAPI.updateVehicleStatus(bookingId, newStatus, `Stato aggiornato a: ${STATUS_LABELS[newStatus]}`);
      Alert.alert('Successo', 'Stato aggiornato!');
      loadBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Errore', 'Impossibile aggiornare lo stato');
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await adminAPI.updateBooking(bookingId, { status: 'confirmed' });
      Alert.alert('Successo', 'Prenotazione confermata!');
      loadBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Errore', 'Impossibile confermare');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await adminAPI.updateBooking(bookingId, { status: 'rejected' });
      Alert.alert('Rifiutata', 'Prenotazione rifiutata');
      loadBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Alert.alert('Errore', 'Impossibile rifiutare');
    }
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
      {/* Header with Guida button */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Pannello Admin</Text>
        <TouchableOpacity 
          style={styles.guidaButton}
          onPress={() => router.push('/manuale')}
        >
          <Ionicons name="book" size={18} color="#9b59b6" />
          <Text style={styles.guidaText}>Guida</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {([
          { key: 'today', label: 'Oggi' },
          { key: 'pending', label: 'In corso' },
          { key: 'all', label: 'Tutte' },
        ] as const).map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
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
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nessuna prenotazione</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.booking_id}
              style={styles.bookingCard}
              onPress={() => setSelectedBooking(selectedBooking?.booking_id === booking.booking_id ? null : booking)}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[booking.current_status || 'waiting'] }]} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {booking.vehicle?.marca} {booking.vehicle?.modello}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {booking.vehicle?.targa} • {booking.user?.name}
                  </Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTime}>
                    {format(new Date(booking.scheduled_date), 'HH:mm')}
                  </Text>
                  <Text style={styles.cardService}>{booking.service?.name}</Text>
                </View>
              </View>

              {/* Status Badge */}
              <View style={styles.cardStatus}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[booking.current_status || 'waiting'] + '20' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[booking.current_status || 'waiting'] }]}>
                    {STATUS_LABELS[booking.current_status || 'waiting']}
                  </Text>
                </View>
                <Ionicons
                  name={selectedBooking?.booking_id === booking.booking_id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </View>

              {/* Expanded Content */}
              {selectedBooking?.booking_id === booking.booking_id && (
                <View style={styles.expanded}>
                  {/* Pending Actions */}
                  {booking.status === 'pending' && (
                    <View style={styles.pendingActions}>
                      <Text style={styles.pendingLabel}>Richiesta in attesa di conferma</Text>
                      <View style={styles.pendingButtons}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.confirmBtn]}
                          onPress={() => handleConfirmBooking(booking.booking_id)}
                        >
                          <Ionicons name="checkmark" size={20} color={COLORS.white} />
                          <Text style={styles.actionBtnText}>Conferma</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.rejectBtn]}
                          onPress={() => handleRejectBooking(booking.booking_id)}
                        >
                          <Ionicons name="close" size={20} color={COLORS.white} />
                          <Text style={styles.actionBtnText}>Rifiuta</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Status Update */}
                  {booking.status === 'confirmed' && (
                    <View style={styles.statusUpdate}>
                      <Text style={styles.updateLabel}>Aggiorna Stato Veicolo</Text>
                      <View style={styles.statusButtons}>
                        {VEHICLE_STATUSES.map((s) => (
                          <TouchableOpacity
                            key={s.value}
                            style={[
                              styles.statusBtn,
                              booking.current_status === s.value && styles.statusBtnActive,
                            ]}
                            onPress={() => handleUpdateStatus(booking.booking_id, s.value)}
                          >
                            <Text
                              style={[
                                styles.statusBtnText,
                                booking.current_status === s.value && styles.statusBtnTextActive,
                              ]}
                            >
                              {s.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Contact Info */}
                  <View style={styles.contactInfo}>
                    <Ionicons name="mail" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.contactText}>{booking.user?.email}</Text>
                  </View>
                  
                  {booking.notes && (
                    <View style={styles.notes}>
                      <Ionicons name="document-text" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.notesText}>{booking.notes}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
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
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  cardTime: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardService: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pendingActions: {
    marginBottom: 16,
  },
  pendingLabel: {
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '500',
    marginBottom: 12,
  },
  pendingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmBtn: {
    backgroundColor: COLORS.success,
  },
  rejectBtn: {
    backgroundColor: COLORS.error,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  statusUpdate: {
    marginBottom: 16,
  },
  updateLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  statusBtnActive: {
    backgroundColor: COLORS.primary,
  },
  statusBtnText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBtnTextActive: {
    color: COLORS.white,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  notes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
