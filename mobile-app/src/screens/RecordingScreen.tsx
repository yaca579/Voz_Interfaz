import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Transcription: { audioUri: string };
};

type RecordingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recording'>;
type RecordingScreenProps = NativeStackScreenProps<RootStackParamList, 'Recording'>;
type RecordingScreenRouteProp = RecordingScreenProps['route'];

export default function RecordingScreen() {
  const navigation = useNavigation<RecordingScreenNavigationProp>();
  const route = useRoute<RecordingScreenRouteProp>();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      if (durationInterval.current) clearInterval(durationInterval.current);
      if (recording) recording.stopAndUnloadAsync();
    };
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setPermissionGranted(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso al micrófono para grabar audio.');
    }
  };

  const startRecording = async () => {
    if (!permissionGranted) return;
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(newRecording);
      setIsRecording(true);
      setDuration(0);
      durationInterval.current = setInterval(() => setDuration(prev => prev + 1), 1000);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      setIsRecording(false);
      if (durationInterval.current) clearInterval(durationInterval.current);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) navigation.navigate('Transcription', { audioUri: uri });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la grabación');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.statusPill, isRecording ? styles.statusRecording : styles.statusIdle]}>
          <View style={[styles.statusDot, isRecording && styles.statusDotRecording]} />
          <Text style={[styles.statusText, isRecording ? styles.textRecording : styles.textIdle]}>
            {isRecording ? 'GRABANDO' : 'LISTO PARA GRABAR'}
          </Text>
        </View>

        <Text style={styles.timer}>{formatTime(duration)}</Text>
        <Text style={styles.timerLabel}>Duración</Text>

        <View style={styles.waveformContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                isRecording && {
                  height: Math.random() * 28 + 8,
                  backgroundColor: '#ef4444',
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.recordBtn, isRecording ? styles.recordingBtn : styles.idleBtn]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!permissionGranted}
          activeOpacity={0.85}
        >
          <View style={[styles.recordBtnInner, isRecording && styles.recordBtnInnerRecording]}>
            <Text style={styles.recordBtnIcon}>{isRecording ? '⏹' : '🎙'}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.recordBtnLabel}>
          {isRecording ? 'Detener Grabación' : 'Toca para grabar'}
        </Text>

        {!permissionGranted && (
          <Text style={styles.permissionText}>Otorga permiso de micrófono en la configuración</Text>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginBottom: 40,
    gap: 8,
  },
  statusIdle: {
    backgroundColor: 'rgba(100,116,139,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(100,116,139,0.3)',
  },
  statusRecording: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64748b',
  },
  statusDotRecording: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  textIdle: { color: '#64748b' },
  textRecording: { color: '#ef4444' },
  timer: {
    fontSize: 72,
    fontWeight: '200',
    color: '#f1f5f9',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  timerLabel: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 32,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    gap: 4,
    marginBottom: 40,
    opacity: 0.4,
  },
  waveBar: {
    width: 4,
    borderRadius: 4,
    height: 8,
    backgroundColor: '#4f46e5',
  },
  recordBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  idleBtn: {
    backgroundColor: 'rgba(79,70,229,0.2)',
    borderWidth: 3,
    borderColor: '#4f46e5',
  },
  recordingBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 3,
    borderColor: '#ef4444',
  },
  recordBtnInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  recordBtnInnerRecording: {
    backgroundColor: '#ef4444',
    borderRadius: 24,
    shadowColor: '#ef4444',
  },
  recordBtnIcon: {
    fontSize: 32,
  },
  recordBtnLabel: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 24,
  },
  permissionText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  backBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});