import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Transcription: { audioUri: string };
};

type TranscriptionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Transcription'>;
type TranscriptionScreenProps = NativeStackScreenProps<RootStackParamList, 'Transcription'>;
type TranscriptionScreenRouteProp = TranscriptionScreenProps['route'];

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const MODEL = "gemini-3.5-flash-lite";

export default function TranscriptionScreen() {
  const navigation = useNavigation<TranscriptionScreenNavigationProp>();
  const route = useRoute<TranscriptionScreenRouteProp>();
  const { audioUri } = route.params;

  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadAudioAndTranscribe();
    return () => { if (sound) sound.unloadAsync(); };
  }, []);

  const loadAudioAndTranscribe = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(newSound);
      await transcribeAudio(audioUri);
    } catch (err) {
      setError('Error al cargar el audio');
      setIsLoading(false);
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('Archivo no encontrado');

      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mimeType = uri.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Transcribe este audio al español. Devuelve solo el texto transcrito sin formato adicional." },
                { inline_data: { mime_type: mimeType, data: base64Audio } },
              ],
            }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo transcribir';
      setTranscription(text.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al transcribir');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => { if (sound) await sound.replayAsync(); };

  const copyToClipboard = () => {
    if (transcription) Alert.alert('Copiado', 'Transcripción copiada al portapapeles');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Transcribiendo con Gemini AI...</Text>
        <Text style={styles.loadingSubtext}>Procesando audio</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>RESULTADO</Text>
          <Text style={styles.cardTitle}>Transcripción</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => { setIsLoading(true); setError(null); transcribeAudio(audioUri); }}>
              <Text style={styles.retryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!error && (
          <>
            <View style={styles.audioSection}>
              <TouchableOpacity style={styles.playBtn} onPress={playAudio}>
                <Text style={styles.playBtnIcon}>▶</Text>
                <Text style={styles.playBtnText}>Reproducir Audio</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transcriptSection}>
              <View style={styles.transcriptHeader}>
                <Text style={styles.transcriptLabel}>TEXTO</Text>
                <Text style={styles.wordCount}>
                  {transcription.trim().split(/\s+/).filter(Boolean).length} palabras
                </Text>
              </View>
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptText}>
                  {transcription || 'No se detectó texto en el audio'}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={copyToClipboard}>
                <Text style={styles.actionBtnText}>📋 Copiar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => { navigation.popToTop(); navigation.navigate('Recording'); }}>
                <Text style={styles.actionBtnPrimaryText}>🎙 Nueva Grabación</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.popToTop()}>
        <Text style={styles.homeBtnText}>← Volver al Inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flexGrow: 1, padding: 24, paddingBottom: 48 },
  loadingContainer: {
    flex: 1, backgroundColor: '#0f172a',
    justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  loadingText: { color: '#f1f5f9', fontSize: 18, fontWeight: '600' },
  loadingSubtext: { color: '#64748b', fontSize: 14 },
  card: {
    backgroundColor: 'rgba(30,41,59,0.8)',
    borderRadius: 24, borderWidth: 1, borderColor: '#334155',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: 'rgba(79,70,229,0.15)',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79,70,229,0.2)',
  },
  cardLabel: {
    color: '#4f46e5', fontSize: 11, fontWeight: '700',
    letterSpacing: 2, marginBottom: 6,
  },
  cardTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: '700' },
  errorContainer: { padding: 32, alignItems: 'center', gap: 16 },
  errorIcon: { fontSize: 32 },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#ef4444', paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 12,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  audioSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#334155' },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(79,70,229,0.1)', paddingVertical: 16,
    borderRadius: 14, gap: 10,
    borderWidth: 1, borderColor: 'rgba(79,70,229,0.3)',
  },
  playBtnIcon: { color: '#818cf8', fontSize: 18 },
  playBtnText: { color: '#818cf8', fontSize: 16, fontWeight: '600' },
  transcriptSection: { padding: 20 },
  transcriptHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12, alignItems: 'center',
  },
  transcriptLabel: {
    color: '#475569', fontSize: 11, fontWeight: '700', letterSpacing: 2,
  },
  wordCount: { color: '#64748b', fontSize: 12, fontWeight: '500' },
  transcriptBox: {
    backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 16,
    borderWidth: 1, borderColor: '#334155', padding: 20, minHeight: 140,
  },
  transcriptText: { color: '#f1f5f9', fontSize: 16, lineHeight: 26 },
  actions: {
    flexDirection: 'row', padding: 20, gap: 10,
    borderTopWidth: 1, borderTopColor: '#334155',
  },
  actionBtn: {
    flex: 1, backgroundColor: 'transparent', paddingVertical: 16,
    borderRadius: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  actionBtnText: { color: '#94a3b8', fontSize: 15, fontWeight: '600' },
  actionBtnPrimary: {
    flex: 1, backgroundColor: '#4f46e5', paddingVertical: 16,
    borderRadius: 14, alignItems: 'center',
    shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  actionBtnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  homeBtn: { marginTop: 24, paddingVertical: 14, alignItems: 'center' },
  homeBtnText: { color: '#64748b', fontSize: 15, fontWeight: '500' },
});