import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth-store';
import {
  fetchActivityEntries,
  createActivityEntry,
  type ActivityEntryDto,
} from '../../services/fielder-service';
import { startSpeechToText } from '../../services/speech-service';
import { useBranding } from '../../theme/branding';
import Voice from '@react-native-voice/voice';

export const ActivityEntriesScreen: React.FC = () => {
  const route = useRoute<any>();
  const token = useAuthStore((state) => state.token);
  const {
    primaryColor,
    backgroundColor,
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    cardBackgroundColor,
    borderBaseColor,
    inputBackgroundColor,
  } = useBranding();

  const { activityUuid, activityTitle, projectTitle } = route.params ?? {};

  const [entries, setEntries] = useState<ActivityEntryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBody, setNewBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!token || !activityUuid) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchActivityEntries(activityUuid, token);
        if (!isMounted) return;
        setEntries(data);
      } catch {
        if (!isMounted) return;
        setError('Failed to load entries');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [token, activityUuid]);

  // Cleanup Voice listeners on unmount
  useEffect(() => {
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleAddEntry = async () => {
    if (!token || !activityUuid || !newBody.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const created = await createActivityEntry(activityUuid, token, {
        body: newBody.trim(),
        data: null,
      });
      setEntries((prev) => [created, ...prev]);
      setNewBody('');
    } catch {
      setError('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMicPress = async () => {
    setIsListening(true);
    try {
      const transcript = await startSpeechToText();
      setNewBody((prev) => (prev ? `${prev} ${transcript}` : transcript));
    } catch (e: any) {
      console.error('Mic error:', e);
      Alert.alert('Speech-to-text error', e.message || 'Failed to recognize speech');
    } finally {
      setIsListening(false);
    }
  };

  const handleAttachPress = () => {
    Alert.alert('Attach file', 'File attachment UI to be implemented');
  };

  const handleImagePress = () => {
    Alert.alert('Attach image', 'Image attachment UI to be implemented');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryTextColor }]}>
        {activityTitle ?? 'Activity entries'}
      </Text>
      {projectTitle ? (
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{projectTitle}</Text>
      ) : null}

      <Text style={[styles.status, { color: mutedTextColor }]}>
        {isLoading ? 'Loading entries...' : error ? error : null}
      </Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {entries.map((entry) => (
          <View key={entry.uuid} style={[styles.entryCard, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.entryMeta, { color: mutedTextColor }]}>
              {entry.created_at ?? ''}
            </Text>
            {entry.user ? (
              <Text style={[styles.entryMeta, { color: mutedTextColor }]}>{`By ${entry.user.email}`}</Text>
            ) : null}
            {entry.body ? (
              <Text style={[styles.entryBody, { color: primaryTextColor }]}>{entry.body}</Text>
            ) : null}
            {entry.attachments.length > 0 ? (
              <Text style={[styles.entryMeta, { color: mutedTextColor }]}>
                {entry.attachments.length} attachment{entry.attachments.length === 1 ? '' : 's'}
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.newEntryContainer, { borderTopColor: borderBaseColor }]}>
        <View style={styles.inputRow}>
          <TextInput
            value={newBody}
            onChangeText={setNewBody}
            placeholder="Add a quick note about this activity..."
            placeholderTextColor={mutedTextColor}
            multiline
            style={[
              styles.newEntryInput,
              {
                borderColor: borderBaseColor,
                backgroundColor: inputBackgroundColor,
                color: primaryTextColor,
              },
            ]}
          />
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: borderBaseColor }]}
              onPress={handleMicPress}
              disabled={isListening}
            >
              <Text style={[styles.iconText, { color: isListening ? '#aaa' : primaryTextColor }]}>
                {isListening ? '...' : '🎤'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: borderBaseColor }]}
              onPress={handleAttachPress}
            >
              <Text style={[styles.iconText, { color: primaryTextColor }]}>📎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: borderBaseColor }]}
              onPress={handleImagePress}
            >
              <Text style={[styles.iconText, { color: primaryTextColor }]}>🖼️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title={isSaving ? 'Saving...' : 'Add entry'}
          onPress={handleAddEntry}
          color={primaryColor}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#ccc',
    marginBottom: 12,
  },
  status: {
    color: '#ff6b6b',
    marginBottom: 8,
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  entryCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  entryMeta: {
    color: '#aaa',
    fontSize: 12,
  },
  entryBody: {
    color: '#fff',
    marginTop: 4,
  },
  newEntryContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 8,
    paddingBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newEntryInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 60,
    flex: 1,
    marginRight: 8,
  },
  iconRow: {
    justifyContent: 'space-between',
  },
  iconButton: {
    borderWidth: 1,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconText: {
    fontSize: 18,
  },
});
