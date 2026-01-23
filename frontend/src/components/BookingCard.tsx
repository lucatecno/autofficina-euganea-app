import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { Booking, Vehicle, Service } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  vehicle?: Vehicle;
  service?: Service;
  currentStatus?: string;
  onPress?: () => void;
}

export function BookingCard({ booking, vehicle, service, currentStatus, onPress }: BookingCardProps) {
  const statusColor = STATUS_COLORS[currentStatus || booking.status] || COLORS.secondary;
  const statusLabel = STATUS_LABELS[currentStatus || booking.status] || booking.status;

  const formattedDate = format(new Date(booking.scheduled_date), "EEEE d MMMM, HH:mm", { locale: it });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.serviceInfo}>
            <Ionicons name="car-sport" size={24} color={COLORS.primary} />
            <View style={styles.serviceTitles}>
              <Text style={styles.serviceName}>{service?.name || 'Servizio'}</Text>
              <Text style={styles.vehicleInfo}>
                {vehicle ? `${vehicle.marca} ${vehicle.modello} • ${vehicle.targa}` : 'Veicolo'}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          {booking.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>{booking.notes}</Text>
            </View>
          )}
        </View>
        
        {onPress && (
          <View style={styles.arrow}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 6,
  },
  statusBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceTitles: {
    marginLeft: 12,
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  vehicleInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  arrow: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
});
