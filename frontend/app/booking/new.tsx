import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { vehiclesAPI, servicesAPI, slotsAPI, bookingsAPI } from '../../src/services/api';
import { Vehicle, Service, TimeSlot } from '../../src/types';
import { VehicleCard, ServiceCard, Button } from '../../src/components';
import { COLORS } from '../../src/utils/constants';

export default function NewBookingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  // Selection
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadInitialData = async () => {
    try {
      const [vehiclesData, servicesData] = await Promise.all([
        vehiclesAPI.getAll(),
        servicesAPI.getAll(),
      ]);
      setVehicles(vehiclesData);
      setServices(servicesData);

      // Generate available dates (next 14 days, excluding Sundays)
      const dates: string[] = [];
      for (let i = 0; i < 14; i++) {
        const date = addDays(new Date(), i);
        if (date.getDay() !== 0) { // Skip Sundays
          dates.push(format(date, 'yyyy-MM-dd'));
        }
      }
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Errore', 'Impossibile caricare i dati');
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (date: string) => {
    try {
      const data = await slotsAPI.getAvailable(date, selectedService?.service_id);
      setSlots(data.slots);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedVehicle) {
      Alert.alert('Attenzione', 'Seleziona un veicolo');
      return;
    }
    if (step === 2 && !selectedService) {
      Alert.alert('Attenzione', 'Seleziona un servizio');
      return;
    }
    if (step === 3 && !selectedSlot) {
      Alert.alert('Attenzione', 'Seleziona un orario');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!selectedVehicle || !selectedService || !selectedSlot) return;

    setSubmitting(true);
    try {
      await bookingsAPI.create({
        vehicle_id: selectedVehicle.vehicle_id,
        service_id: selectedService.service_id,
        scheduled_date: selectedSlot.datetime,
        notes: notes || undefined,
      });
      Alert.alert(
        'Prenotazione Inviata!',
        'Riceverai una conferma a breve.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/bookings') }]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Errore', 'Impossibile creare la prenotazione');
    } finally {
      setSubmitting(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuova Prenotazione</Text>
          <View style={styles.headerButton} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Step 1: Select Vehicle */}
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>Seleziona Veicolo</Text>
              <Text style={styles.stepSubtitle}>Quale veicolo vuoi portare?</Text>
              
              {vehicles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="car-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>Nessun veicolo registrato</Text>
                  <Button
                    title="Aggiungi Veicolo"
                    onPress={() => router.push('/vehicle/new')}
                    size="small"
                  />
                </View>
              ) : (
                vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.vehicle_id}
                    vehicle={vehicle}
                    selected={selectedVehicle?.vehicle_id === vehicle.vehicle_id}
                    onPress={() => setSelectedVehicle(vehicle)}
                  />
                ))
              )}
            </View>
          )}

          {/* Step 2: Select Service */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Tipo di Intervento</Text>
              <Text style={styles.stepSubtitle}>Di cosa hai bisogno?</Text>
              
              {services.map((service) => (
                <ServiceCard
                  key={service.service_id}
                  service={service}
                  selected={selectedService?.service_id === service.service_id}
                  onPress={() => setSelectedService(service)}
                />
              ))}
            </View>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>Scegli Data e Ora</Text>
              <Text style={styles.stepSubtitle}>Quando preferisci venire?</Text>
              
              {/* Date Selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dateScroll}
              >
                {availableDates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[
                        styles.dateCard,
                        isSelected && styles.dateCardSelected,
                      ]}
                      onPress={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                    >
                      <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                        {format(dateObj, 'EEE', { locale: it })}
                      </Text>
                      <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>
                        {format(dateObj, 'd')}
                      </Text>
                      <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                        {format(dateObj, 'MMM', { locale: it })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Time Slots */}
              <Text style={styles.slotLabel}>Orari Disponibili</Text>
              <View style={styles.slotsGrid}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.slotCard,
                      !slot.available && styles.slotCardDisabled,
                      selectedSlot?.time === slot.time && styles.slotCardSelected,
                    ]}
                    onPress={() => slot.available && setSelectedSlot(slot)}
                    disabled={!slot.available}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        !slot.available && styles.slotTimeDisabled,
                        selectedSlot?.time === slot.time && styles.slotTimeSelected,
                      ]}
                    >
                      {slot.time}
                    </Text>
                    {slot.available && (
                      <Text style={styles.slotSpots}>
                        {slot.spots_left} post{slot.spots_left === 1 ? 'o' : 'i'}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <View>
              <Text style={styles.stepTitle}>Riepilogo</Text>
              <Text style={styles.stepSubtitle}>Controlla i dettagli</Text>
              
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Ionicons name="car" size={20} color={COLORS.primary} />
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryLabel}>Veicolo</Text>
                    <Text style={styles.summaryValue}>
                      {selectedVehicle?.marca} {selectedVehicle?.modello} ({selectedVehicle?.targa})
                    </Text>
                  </View>
                </View>
                
                <View style={styles.summaryRow}>
                  <Ionicons name="construct" size={20} color={COLORS.primary} />
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryLabel}>Servizio</Text>
                    <Text style={styles.summaryValue}>{selectedService?.name}</Text>
                  </View>
                </View>
                
                <View style={styles.summaryRow}>
                  <Ionicons name="calendar" size={20} color={COLORS.primary} />
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryLabel}>Data e Ora</Text>
                    <Text style={styles.summaryValue}>
                      {selectedDate && format(new Date(selectedDate), "EEEE d MMMM yyyy", { locale: it })}, {selectedSlot?.time}
                    </Text>
                  </View>
                </View>
                
                {selectedService?.price_estimate && (
                  <View style={styles.summaryRow}>
                    <Ionicons name="pricetag" size={20} color={COLORS.primary} />
                    <View style={styles.summaryInfo}>
                      <Text style={styles.summaryLabel}>Preventivo</Text>
                      <Text style={styles.summaryValue}>da €{selectedService.price_estimate}</Text>
                    </View>
                  </View>
                )}
              </View>

              <Text style={styles.notesLabel}>Note (opzionale)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Aggiungi note o richieste particolari..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Button
            title={step === 4 ? 'Conferma Prenotazione' : 'Avanti'}
            onPress={handleNext}
            loading={submitting}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dateScroll: {
    marginBottom: 24,
  },
  dateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 64,
  },
  dateCardSelected: {
    backgroundColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  dateDaySelected: {
    color: COLORS.white,
  },
  dateNum: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 4,
  },
  dateNumSelected: {
    color: COLORS.white,
  },
  dateMonth: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  dateMonthSelected: {
    color: COLORS.white,
  },
  slotLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  slotCardDisabled: {
    opacity: 0.4,
  },
  slotCardSelected: {
    backgroundColor: COLORS.primary,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  slotTimeDisabled: {
    color: COLORS.textMuted,
  },
  slotTimeSelected: {
    color: COLORS.white,
  },
  slotSpots: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  notesLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
