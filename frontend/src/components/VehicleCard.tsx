import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
}

export function VehicleCard({ vehicle, onPress, onEdit, onDelete, selected }: VehicleCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="car" size={32} color={selected ? COLORS.primary : COLORS.textSecondary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.brandModel}>
          {vehicle.marca} {vehicle.modello}
        </Text>
        <Text style={styles.plate}>{vehicle.targa}</Text>
        {vehicle.anno && (
          <Text style={styles.year}>Anno: {vehicle.anno}</Text>
        )}
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        )}
        {selected && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </View>
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
  info: {
    flex: 1,
    marginLeft: 16,
  },
  brandModel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  plate: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  year: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
