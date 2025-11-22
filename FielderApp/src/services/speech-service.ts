import Voice from '@react-native-voice/voice';
import { Platform } from 'react-native';

export const startSpeechToText = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    // Detect Expo Go (no native module linking)
    if (Platform.constants?.Brand === 'google' && Platform.OS === 'android' && !Voice) {
      reject(new Error('Speech-to-text requires a development build (expo run:android), not Expo Go.'));
      return;
    }

    try {
      // Check if the native module is present
      if (!Voice || !Voice.isAvailable) {
        reject(new Error('Speech-to-text native module not available. Use expo run:android or expo run:ios.'));
        return;
      }

      const isAvailable = await Voice.isAvailable();
      console.log('Voice.isAvailable:', isAvailable);
      if (!isAvailable) {
        reject(new Error('Speech recognition not available on this device'));
        return;
      }

      Voice.start('en-US');
      console.log('Voice.start called');

      const onResults = (e: any) => {
        console.log('Voice.onSpeechResults:', e);
        const transcript = e.value?.[0] ?? '';
        if (transcript) {
          Voice.destroy().then(Voice.removeAllListeners);
          resolve(transcript);
        }
      };

      const onError = (e: any) => {
        console.log('Voice.onSpeechError:', e);
        Voice.destroy().then(Voice.removeAllListeners);
        reject(new Error(e.error || 'Unknown speech error'));
      };

      Voice.onSpeechResults = onResults;
      Voice.onSpeechError = onError;
    } catch (err) {
      console.error('startSpeechToText exception:', err);
      reject(err);
    }
  });
};
