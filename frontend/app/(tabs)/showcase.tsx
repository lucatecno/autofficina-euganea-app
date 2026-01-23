import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/utils/constants';

// Placeholder for Instagram integration
// In production, this would fetch from Instagram API
const SHOWCASE_ITEMS = [
  {
    id: '1',
    title: 'Restauro Fiat 500 d\'epoca',
    category: 'Restauro',
    description: 'Restauro completo di una Fiat 500 del 1968',
  },
  {
    id: '2',
    title: 'Tuning Audi RS3',
    category: 'Tuning',
    description: 'Elaborazione motore e assetto sportivo',
  },
  {
    id: '3',
    title: 'Riparazione carrozzeria BMW',
    category: 'Carrozzeria',
    description: 'Riparazione danni da grandine',
  },
  {
    id: '4',
    title: 'Manutenzione Mercedes AMG',
    category: 'Manutenzione',
    description: 'Tagliando completo e revisione freni',
  },
];

export default function ShowcaseScreen() {
  const openInstagram = () => {
    // Replace with actual Instagram profile
    Linking.openURL('https://www.instagram.com/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Instagram Banner */}
        <TouchableOpacity style={styles.instagramBanner} onPress={openInstagram}>
          <Ionicons name="logo-instagram" size={24} color="#E4405F" />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Seguici su Instagram</Text>
            <Text style={styles.bannerSubtitle}>@autofficina_euganea</Text>
          </View>
          <Ionicons name="open-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Scopri i nostri lavori migliori! Per vedere tutti i contenuti, seguici su Instagram.
        </Text>

        {/* Showcase Grid */}
        <View style={styles.grid}>
          {SHOWCASE_ITEMS.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardImage}>
                <Ionicons name="image" size={48} color={COLORS.textMuted} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Vuoi un intervento simile?</Text>
          <Text style={styles.ctaText}>
            Contattaci o prenota direttamente dall'app!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  instagramBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 160,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
