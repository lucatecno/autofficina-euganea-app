import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { vehiclesAPI } from '../../src/services/api';
import { Button } from '../../src/components';
import { COLORS } from '../../src/utils/constants';

export default function NewVehicleScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marca, setMarca] = useState('');
  const [modello, setModello] = useState('');
  const [targa, setTarga] = useState('');
  const [anno, setAnno] = useState('');

  const handleSubmit = async () => {
    if (!marca.trim() || !modello.trim() || !targa.trim()) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    setLoading(true);
    try {
      await vehiclesAPI.create({
        marca: marca.trim(),
        modello: modello.trim(),
        targa: targa.trim().toUpperCase(),
        anno: anno ? parseInt(anno, 10) : undefined,
      });
      Alert.alert('Veicolo Aggiunto!', '', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      Alert.alert('Errore', 'Impossibile aggiungere il veicolo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aggiungi Veicolo</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Inserisci i dati del tuo veicolo per velocizzare le prenotazioni future.
          </Text>

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
            title="Aggiungi Veicolo"
            onPress={handleSubmit}
            loading={loading}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
    lineHeight: 20,
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
