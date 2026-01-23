import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
  selected?: boolean;
}

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  switch (category) {
    case 'tagliando': return 'car';
    case 'gomme': return 'ellipse-outline';
    case 'diagnosi': return 'analytics';
    case 'riparazione': return 'build';
    case 'tuning': return 'speedometer';
    default: return 'construct';
  }
};

export function ServiceCard({ service, onPress, selected }: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, selected && styles.iconSelected]}>
        <Ionicons
          name={getCategoryIcon(service.category)}
          size={28}
          color={selected ? COLORS.white : COLORS.primary}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.metaText}>~{service.estimated_hours}h</Text>
          </View>
          {service.price_estimate && (
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.metaText}>da €{service.price_estimate}</Text>
            </View>
          )}
        </View>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.check} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: COLORS.primary,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  check: {
    marginLeft: 8,
  },
});
