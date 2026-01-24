import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { COLORS } from '../src/utils/constants';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
          headerBackTitle: 'Indietro',
          headerBackTitleVisible: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="booking/new" 
          options={{ 
            title: 'Nuova Prenotazione',
            presentation: 'modal',
            headerLeft: undefined,
          }} 
        />
        <Stack.Screen 
          name="booking/[id]" 
          options={{ 
            title: 'Dettagli Prenotazione',
          }} 
        />
        <Stack.Screen 
          name="vehicle/new" 
          options={{ 
            title: 'Aggiungi Veicolo',
            presentation: 'modal',
            headerLeft: undefined,
          }} 
        />
        <Stack.Screen 
          name="vehicle/[id]" 
          options={{ 
            title: 'Modifica Veicolo',
            presentation: 'modal',
            headerLeft: undefined,
          }} 
        />
        <Stack.Screen 
          name="admin" 
          options={{ 
            title: 'Pannello Admin',
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
