import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Transcription: { audioUri: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoInner}>
            <Text style={styles.logoIcon}>🎙️</Text>
          </View>
        </View>
        <Text style={styles.title}>Speech-to-Text</Text>
        <Text style={styles.subtitle}>Transcripción de voz con Gemini AI</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.recordBtn} onPress={() => navigation.navigate('Recording')} activeOpacity={0.85}>
          <Text style={styles.recordBtnText}>Iniciar Grabación</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>es-ES</Text>
            <Text style={styles.statLabel}>Idioma</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>Tiempo real</Text>
            <Text style={styles.statLabel}>Modo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>IA</Text>
            <Text style={styles.statLabel}>Motor</Text>
          </View>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionLabel}>CARACTERÍSTICAS</Text>
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(79,70,229,0.15)' }]}>
              <Text style={styles.featureIcon}>📱</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Grabación nativa</Text>
              <Text style={styles.featureDesc}>Alta calidad con expo-av</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(6,182,212,0.15)' }]}>
              <Text style={styles.featureIcon}>🤖</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Gemini AI</Text>
              <Text style={styles.featureDesc}>Transcripción precisa</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Text style={styles.featureIcon}>⚡</Text>
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Español nativo</Text>
              <Text style={styles.featureDesc}>Optimizado es-ES</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>¿Cómo funciona?</Text>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
          <Text style={styles.stepText}>Toca "Iniciar Grabación"</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
          <Text style={styles.stepText}>Habla claramente en español</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
          <Text style={styles.stepText}>Detén cuando termines</Text>
        </View>
        <View style={styles.step}>
          <View style={[styles.stepNum, styles.stepNumLast]}><Text style={styles.stepNumText}>4</Text></View>
          <Text style={styles.stepText}>Gemini transcribe automáticamente</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(79,70,229,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 6,
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.8)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 28,
  },
  recordBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  recordBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#818cf8',
    fontSize: 14,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#334155',
  },
  featuresSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 2,
    marginBottom: 14,
  },
  features: {
    gap: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  stepsCard: {
    backgroundColor: 'rgba(79,70,229,0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(79,70,229,0.2)',
  },
  stepsTitle: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 18,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumLast: {
    backgroundColor: '#10b981',
  },
  stepNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    color: '#cbd5e1',
    fontSize: 15,
    flex: 1,
  },
});