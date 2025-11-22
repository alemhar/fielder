import { API_BASE_URL } from '../config/api';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

export interface CloudSpeechOptions {
  languageCode?: string;
  maxDurationSeconds?: number;
}

export const startCloudSpeechToText = async (
  token: string,
  options: CloudSpeechOptions = {}
): Promise<string> => {
  const { languageCode = 'en-US', maxDurationSeconds = 10 } = options;

  // Request permission and prepare audio
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Microphone permission not granted');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  // Record audio
  const recording = new Audio.Recording();
  try {
    await recording.prepareToRecordAsync({
      android: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
        sampleRate: 16000,
        numberOfChannels: 1,
      },
      ios: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    });

    await recording.startAsync();
    await new Promise((resolve) => setTimeout(resolve, maxDurationSeconds * 1000));
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    if (!uri) {
      throw new Error('Recording failed to produce a file');
    }

    // Read audio as base64
    const audioBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send to backend
    const res = await fetch(`${API_BASE_URL}/api/speech-to-text`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audioBase64,
        sampleRate: 16000,
        languageCode,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Speech-to-text request failed');
    }

    const { transcript } = await res.json();
    return transcript || '';
  } finally {
    // Clean up using new File API
    const uri = recording.getURI();
    if (uri) {
      try {
        const file = new FileSystem.File(uri);
        await file.deleteAsync();
      } catch {
        // Ignore cleanup errors
      }
    }
  }
};
