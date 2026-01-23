import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { vehiclesAPI } from '../../src/services/api';
import { Vehicle } from '../../src/types';
import { Button } from '../../src/components';
import { COLORS } from '../../src/utils/constants';

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [marca, setMarca] = useState('');
  const [modello, setModello] = useState('');
  const [targa, setTarga] = useState('');
  const [anno, setAnno] = useState('');

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      const vehicles = await vehiclesAPI.getAll();
      const found = vehicles.find(v => v.vehicle_id === id);
      if (found) {
        setVehicle(found);
        setMarca(found.marca);
        setModello(found.modello);
        setTarga(found.targa);
        setAnno(found.anno?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!marca.trim() || !modello.trim() || !targa.trim()) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    setSaving(true);
    try {
      await vehiclesAPI.update(id!, {
        marca: marca.trim(),
        modello: modello.trim(),
        targa: targa.trim().toUpperCase(),
        anno: anno ? parseInt(anno, 10) : undefined,
      });
      Alert.alert('Veicolo Aggiornato!', '', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Errore', 'Impossibile aggiornare il veicolo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Veicolo non trovato</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Modifica Veicolo</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marca *</Text>
              <TextInput
                style={styles.input}
                value={marca}
                onChangeText={setMarca}
                placeholder="es. Fiat, Volkswagen, BMW"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Modello *</Text>
              <TextInput
                style={styles.input}
                value={modello}
                onChangeText={setModello}
                placeholder="es. Panda, Golf, Serie 3"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Targa *</Text>
              <TextInput
                style={styles.input}
                value={targa}
                onChangeText={setTarga}
                placeholder="es. AB123CD"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Anno (opzionale)</Text>
              <TextInput
                style={styles.input}
                value={anno}
                onChangeText={setAnno}
                placeholder="es. 2020"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Salva Modifiche"
            onPress={handleSubmit}
            loading={saving}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
