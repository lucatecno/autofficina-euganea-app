import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { COLORS } from '../src/utils/constants';
import { Button } from '../src/components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export default function LoginScreen() {
  const { isAuthenticated, isLoading, login, setUser, user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'choice' | 'login' | 'register'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Errore', 'Inserisci email e password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      
      if (response.data.user && response.data.session_token) {
        await AsyncStorage.setItem('session_token', response.data.session_token);
        setUser(response.data.user);
        
        // Redirect manuale immediato
        if (Platform.OS === 'web') {
          setTimeout(() => {
            const isAdmin = response.data.user.role === 'admin';
            window.location.href = isAdmin ? '/admin' : '/(tabs)/home';
          }, 100);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.detail || 'Email o password errati';
      Alert.alert('Errore', message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async () => {
    // Validazione campi obbligatori
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Errore', 'Inserisci un indirizzo email valido');
      return;
    }

    // Validazione nome (solo lettere e spazi)
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
      Alert.alert('Errore', 'Il nome deve contenere solo lettere');
      return;
    }

    // Validazione password
    if (password.length < 6) {
      Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
      return;
    }

    // Validazione telefono (se inserito)
    if (phone.trim()) {
      const phoneClean = phone.trim().replace(/\s/g, '');
      if (!/^[\+]?[0-9]{8,15}$/.test(phoneClean)) {
        Alert.alert('Errore', 'Numero di telefono non valido (es: +39 333 1234567)');
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      
      if (response.data.user && response.data.session_token) {
        await AsyncStorage.setItem('session_token', response.data.session_token);
        setUser(response.data.user);
        
        // Redirect manuale
        if (Platform.OS === 'web') {
          setTimeout(() => {
            const isAdmin = response.data.user.role === 'admin';
            window.location.href = isAdmin ? '/admin' : '/(tabs)/home';
          }, 100);
        }
        
        Alert.alert('✅ Benvenuto!', 'Account creato con successo');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.detail || 'Impossibile creare l\'account';
      Alert.alert('Errore', message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    // Redirect automatico in base al ruolo
    const isAdmin = user?.role === 'admin';
    return <Redirect href={isAdmin ? '/admin' : '/(tabs)/home'} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.wrenchBg}>
                <MaterialCommunityIcons name="wrench" size={80} color={COLORS.secondary} />
              </View>
            </View>
            
            <View style={styles.brandContainer}>
              <Text style={styles.title}>AUTOFFICINA</Text>
              <Text style={styles.subtitle}>EUGANEA</Text>
            </View>
            <Text style={styles.tagline}>La tua officina di fiducia</Text>
          </View>

          {/* Choice Screen */}
          {mode === 'choice' && (
            <View style={styles.choiceSection}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={login}
              >
                <Ionicons name="logo-google" size={24} color={COLORS.white} />
                <Text style={styles.googleButtonText}>Accedi con Google</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OPPURE</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.emailButton}
                onPress={() => setMode('login')}
              >
                <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
                <Text style={styles.emailButtonText}>Accedi con Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => setMode('register')}
              >
                <Text style={styles.registerLinkText}>
                  Non hai un account? <Text style={styles.registerLinkBold}>Registrati</Text>
                </Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                Accedendo, accetti i nostri Termini di Servizio e la Privacy Policy
              </Text>
            </View>
          )}

          {/* Email Login Screen */}
          {mode === 'login' && (
            <View style={styles.formSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setMode('choice')}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                <Text style={styles.backText}>Indietro</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>Accedi con Email</Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tuo@email.it"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="La tua password"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  title="Accedi"
                  onPress={handleEmailLogin}
                  loading={loading}
                  fullWidth
                />

                <TouchableOpacity
                  style={styles.switchLink}
                  onPress={() => setMode('register')}
                >
                  <Text style={styles.switchLinkText}>
                    Non hai un account? <Text style={styles.switchLinkBold}>Registrati</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Email Register Screen */}
          {mode === 'register' && (
            <View style={styles.formSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setMode('choice')}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                <Text style={styles.backText}>Indietro</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>Crea Account</Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome Completo *</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Mario Rossi"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tuo@email.it"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Telefono (opzionale)</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+39 ..."
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password *</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Minimo 6 caratteri"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  title="Registrati"
                  onPress={handleEmailRegister}
                  loading={loading}
                  fullWidth
                />

                <TouchableOpacity
                  style={styles.switchLink}
                  onPress={() => setMode('login')}
                >
                  <Text style={styles.switchLinkText}>
                    Hai già un account? <Text style={styles.switchLinkBold}>Accedi</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  wrenchBg: {
    width: 140,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondaryLight,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  choiceSection: {
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emailButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  registerLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLinkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
  formSection: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: COLORS.text,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 16,
  },
  switchLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  switchLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchLinkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
