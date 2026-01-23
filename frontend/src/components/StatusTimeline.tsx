import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { VehicleStatus } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface StatusTimelineProps {
  statuses: VehicleStatus[];
}

const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
  switch (status) {
    case 'waiting': return 'hourglass-outline';
    case 'checked_in': return 'log-in-outline';
    case 'in_progress': return 'construct-outline';
    case 'testing': return 'speedometer-outline';
    case 'ready': return 'checkmark-circle-outline';
    case 'delivered': return 'car-outline';
    default: return 'ellipse-outline';
  }
};

export function StatusTimeline({ statuses }: StatusTimelineProps) {
  return (
    <View style={styles.container}>
      {statuses.map((status, index) => {
        const isLast = index === statuses.length - 1;
        const color = STATUS_COLORS[status.status] || COLORS.secondary;
        const label = STATUS_LABELS[status.status] || status.status;

        return (
          <View key={status.status_id} style={styles.item}>
            <View style={styles.timeline}>
              <View style={[styles.dot, { backgroundColor: color }]}>
                <Ionicons name={getStatusIcon(status.status)} size={16} color={COLORS.white} />
              </View>
              {!isLast && <View style={[styles.line, { backgroundColor: color + '40' }]} />}
            </View>
            <View style={styles.content}>
              <Text style={[styles.label, { color }]}>{label}</Text>
              <Text style={styles.time}>
                {format(new Date(status.created_at), "d MMM yyyy, HH:mm", { locale: it })}
              </Text>
              {status.notes && (
                <Text style={styles.notes}>{status.notes}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timeline: {
    alignItems: 'center',
    width: 40,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  notes: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
