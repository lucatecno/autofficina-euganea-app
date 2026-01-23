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
import { useRouter } from 'expo-router';
import { vehiclesAPI } from '../../src/services/api';
import { Vehicle } from '../../src/types';
import { VehicleCard, Button } from '../../src/components';
import { COLORS } from '../../src/utils/constants';

export default function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVehicles = async () => {
    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Elimina Veicolo',
      `Sei sicuro di voler eliminare ${vehicle.marca} ${vehicle.modello}?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await vehiclesAPI.delete(vehicle.vehicle_id);
              loadVehicles();
            } catch (error) {
              Alert.alert('Errore', 'Impossibile eliminare il veicolo');
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nessun veicolo registrato</Text>
            <Text style={styles.emptySubtext}>
              Aggiungi il tuo primo veicolo per iniziare
            </Text>
            <View style={styles.emptyAction}>
              <Button
                title="Aggiungi Veicolo"
                onPress={() => router.push('/vehicle/new')}
                icon={<Ionicons name="add" size={20} color={COLORS.white} />}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.count}>{vehicles.length} veicol{vehicles.length === 1 ? 'o' : 'i'} registrat{vehicles.length === 1 ? 'o' : 'i'}</Text>
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.vehicle_id}
                vehicle={vehicle}
                onEdit={() => router.push(`/vehicle/${vehicle.vehicle_id}`)}
                onDelete={() => handleDelete(vehicle)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {vehicles.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/vehicle/new')}
        >
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      )}
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  count: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
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
  emptyAction: {
    marginTop: 24,
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
