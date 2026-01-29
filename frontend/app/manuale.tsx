import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  background: '#1a1a2e',
  surface: '#252542',
  primary: '#4a90d9',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  success: '#27ae60',
  warning: '#e74c3c',
};

export default function ManualeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manuale App</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>MANUALE AUTOFFICINA EUGANEA</Text>
        <Text style={styles.subtitle}>App Web per la Gestione Officina</Text>

        {/* CREDENZIALI */}
        <View style={styles.credentialsBox}>
          <Text style={styles.credentialsTitle}>🔑 CREDENZIALI DI ACCESSO</Text>
          
          <View style={styles.credCard}>
            <Text style={styles.credLabel}>👨‍💼 AMMINISTRATORE</Text>
            <Text style={styles.credText}>Email: <Text style={styles.credValue}>baxadmin@autofficina.it</Text></Text>
            <Text style={styles.credText}>Password: <Text style={styles.credValue}>Bassini1.</Text></Text>
          </View>

          <View style={styles.credCard}>
            <Text style={styles.credLabel}>👤 UTENTE DI PROVA</Text>
            <Text style={styles.credText}>Email: <Text style={styles.credValue}>demo@autofficina.it</Text></Text>
            <Text style={styles.credText}>Password: <Text style={styles.credValue}>Demo1234</Text></Text>
          </View>
        </View>

        {/* GUIDA UTENTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 GUIDA UTENTE</Text>

          <Text style={styles.heading}>1. Come Accedere</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Google:</Text> Clicca "Accedi con Google"</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Email:</Text> Registrati con nome, email e password</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Login:</Text> Inserisci email e password esistenti</Text>

          <Text style={styles.heading}>2. Aggiungere un Veicolo</Text>
          <Text style={styles.bullet}>• Vai su "Veicoli" nella barra in basso</Text>
          <Text style={styles.bullet}>• Clicca "+ Aggiungi Veicolo"</Text>
          <Text style={styles.bullet}>• Inserisci: Marca, Modello, Targa (AB123CD)</Text>
          <Text style={styles.bullet}>• Clicca "Aggiungi Veicolo"</Text>

          <Text style={styles.heading}>3. Prenotare un Servizio</Text>
          <Text style={styles.bullet}>• Clicca "Prenota" nella barra in basso</Text>
          <Text style={styles.bullet}>• Seleziona il veicolo</Text>
          <Text style={styles.bullet}>• Scegli il servizio</Text>
          <Text style={styles.bullet}>• Seleziona data e orario</Text>
          <Text style={styles.bullet}>• Conferma la prenotazione</Text>

          <Text style={styles.heading}>4. Stati Prenotazione</Text>
          <Text style={styles.bullet}>• <Text style={styles.statusPending}>IN ATTESA:</Text> Da confermare</Text>
          <Text style={styles.bullet}>• <Text style={styles.statusConfirmed}>CONFERMATA:</Text> Appuntamento ok</Text>
          <Text style={styles.bullet}>• <Text style={styles.statusWorking}>IN LAVORAZIONE:</Text> Auto in officina</Text>
          <Text style={styles.bullet}>• <Text style={styles.statusDone}>COMPLETATA:</Text> Pronta per ritiro</Text>
        </View>

        {/* GUIDA ADMIN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleGreen}>⚙️ GUIDA AMMINISTRATORE</Text>

          <Text style={styles.heading}>1. Accesso Admin</Text>
          <Text style={styles.bullet}>• Usa le credenziali admin sopra</Text>
          <Text style={styles.bullet}>• Vai automaticamente al Pannello Admin</Text>

          <Text style={styles.heading}>2. Gestione Prenotazioni</Text>
          <Text style={styles.bullet}>• Vedi TUTTE le prenotazioni dei clienti</Text>
          <Text style={styles.bullet}>• Usa i filtri per stato o data</Text>
          <Text style={styles.bullet}>• Clicca su una prenotazione per gestirla</Text>

          <Text style={styles.heading}>3. Azioni Disponibili</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>CONFERMA:</Text> Accetta l'appuntamento</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>INIZIA:</Text> Veicolo arrivato in officina</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>COMPLETA:</Text> Lavoro terminato</Text>
        </View>

        {/* CONTATTI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleOrange}>📞 CONTATTI OFFICINA</Text>
          
          <TouchableOpacity onPress={() => Linking.openURL('tel:+393203145049')}>
            <Text style={styles.contactItem}>📱 +39 320 314 5049</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/393203145049')}>
            <Text style={styles.contactItem}>💬 WhatsApp: +39 320 314 5049</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => Linking.openURL('mailto:autofficinaeuganea@libero.it')}>
            <Text style={styles.contactItem}>✉️ autofficinaeuganea@libero.it</Text>
          </TouchableOpacity>
          
          <Text style={styles.contactItem}>📍 Via Galzignanese 14/A, Battaglia Terme (PD)</Text>
          <Text style={styles.contactItem}>🕐 Lun-Ven: 8:00-19:00 | Sab: 8:00-12:00</Text>
        </View>

        <Text style={styles.footer}>Manuale Autofficina Euganea - Gennaio 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  credentialsBox: {
    backgroundColor: '#2d2d4a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  credentialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginBottom: 12,
    textAlign: 'center',
  },
  credCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  credLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  credText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  credValue: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  sectionTitleGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.success,
  },
  sectionTitleOrange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#f39c12',
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.text,
  },
  statusPending: { color: '#f1c40f', fontWeight: '600' },
  statusConfirmed: { color: '#3498db', fontWeight: '600' },
  statusWorking: { color: '#e67e22', fontWeight: '600' },
  statusDone: { color: '#27ae60', fontWeight: '600' },
  contactItem: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});
