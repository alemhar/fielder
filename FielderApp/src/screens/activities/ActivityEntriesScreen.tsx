import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../stores/auth-store';
import {
  fetchActivityEntries,
  createActivityEntry,
  type ActivityEntryDto,
} from '../../services/fielder-service';
import { startCloudSpeechToText } from '../../services/cloud-speech-service';
import { useBranding } from '../../theme/branding';
import { SectionHeader } from '../../components/SectionHeader';

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
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<DocumentPicker.DocumentPickerResult | null>(null);

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

  const handleMicPress = async () => {
    Alert.alert('Speech-to-text', 'Speech-to-text will be available after backend setup. For now, please type your entry.');
  };

  const handleAddEntry = async () => {
    if (!token || !activityUuid || (!newBody.trim() && !selectedAttachment)) return;
    setIsSaving(true);
    setError(null);
    try {
      const created = await createActivityEntry(activityUuid, token, {
        body: newBody.trim() || undefined,
        data: null,
        attachments: selectedAttachment && !selectedAttachment.canceled ? selectedAttachment.assets : undefined,
      });
      setEntries((prev) => [created, ...prev]);
      setNewBody('');
      setSelectedAttachment(null);
    } catch {
      setError('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachFile = async () => {
    setShowAttachModal(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets.length > 0) {
        setSelectedAttachment(result);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleAttachPhoto = () => {
    setShowAttachModal(false);
    Alert.alert('Attach photo', 'Photo attachment UI to be implemented');
  };

  const handleCapturePhoto = () => {
    setShowAttachModal(false);
    Alert.alert('Capture photo', 'Camera capture UI to be implemented');
  };

  const handleClearAttachment = () => {
    setSelectedAttachment(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <SectionHeader title={activityTitle ?? 'Activity entries'} subtitle={projectTitle} />

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
        {selectedAttachment && !selectedAttachment.canceled && selectedAttachment.assets.length > 0 && (
          <View style={[styles.attachmentPreview, { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor }]}>
            <View style={styles.attachmentRow}>
              <MaterialIcons name="attach-file" size={20} color={primaryTextColor} />
              <Text style={[styles.attachmentName, { color: primaryTextColor }]}>
                {selectedAttachment.assets[0].name}
              </Text>
              <TouchableOpacity onPress={handleClearAttachment}>
                <MaterialIcons name="close" size={20} color={mutedTextColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.newEntryContainer, { borderTopColor: borderBaseColor }]}>
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.attachButton, { borderColor: borderBaseColor }]}
            onPress={() => setShowAttachModal(true)}
          >
            <MaterialIcons name="add" size={24} color={primaryTextColor} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
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
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMicPress}
              disabled={isListening}
            >
              <MaterialIcons
                name={isListening ? 'mic' : 'mic-none'}
                size={20}
                color={isListening ? '#aaa' : primaryTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title={isSaving ? 'Saving...' : 'Add entry'}
          onPress={handleAddEntry}
          color={primaryColor}
        />
      </View>

      {/* Attach Options Modal */}
      <Modal
        transparent
        visible={showAttachModal}
        animationType="fade"
        onRequestClose={() => setShowAttachModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAttachModal(false)}>
          <View style={[styles.attachModal, { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor }]}>
            <TouchableOpacity style={styles.attachOption} onPress={handleAttachFile}>
              <MaterialIcons name="attach-file" size={24} color={primaryTextColor} />
              <Text style={[styles.attachOptionText, { color: primaryTextColor }]}>Attach File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachOption} onPress={handleAttachPhoto}>
              <MaterialIcons name="photo" size={24} color={primaryTextColor} />
              <Text style={[styles.attachOptionText, { color: primaryTextColor }]}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachOption} onPress={handleCapturePhoto}>
              <MaterialIcons name="photo-camera" size={24} color={primaryTextColor} />
              <Text style={[styles.attachOptionText, { color: primaryTextColor }]}>Camera</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  attachmentPreview: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  newEntryInput: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    paddingRight: 44, // space for mic icon inside
  },
  micButton: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  attachModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
  attachOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  attachOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
