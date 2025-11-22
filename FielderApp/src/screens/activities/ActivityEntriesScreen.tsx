import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import { useAuthStore } from '../../stores/auth-store';
import {
  fetchActivityEntries,
  createActivityEntry,
  createActivityEntryFromCamera,
  deleteActivityEntry,
  type ActivityEntryDto,
} from '../../services/fielder-service';
import { startCloudSpeechToText } from '../../services/cloud-speech-service';
import { useBranding } from '../../theme/branding';
import { SectionHeader } from '../../components/SectionHeader';

export const ActivityEntriesScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
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
  const [selectedAttachments, setSelectedAttachments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const loadEntries = useCallback(async () => {
    if (!token || !activityUuid) return;
    let isMounted = true;

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

    return () => {
      isMounted = false;
    };
  }, [token, activityUuid]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  useFocusEffect(
    useCallback(() => {
      void loadEntries();
    }, [loadEntries])
  );

  const handleMicPress = async () => {
    Alert.alert('Speech-to-text', 'Speech-to-text will be available after backend setup. For now, please type your entry.');
  };

  const handleAddEntry = async () => {
    if (!token || !activityUuid || (!newBody.trim() && selectedAttachments.length === 0)) return;
    setIsSaving(true);
    setError(null);
    try {
      // Check if we have camera photos (base64) or regular files
      const cameraPhotos = selectedAttachments.filter(a => a.uri.startsWith('data:'));
      const regularFiles = selectedAttachments.filter(a => !a.uri.startsWith('data:'));
      
      if (cameraPhotos.length > 0 && regularFiles.length === 0) {
        // Only camera photos - use camera endpoint
        const created = await createActivityEntryFromCamera(activityUuid, token, {
          body: newBody.trim() || '',
          data: null,
          photo: cameraPhotos[0].uri,
          photoName: cameraPhotos[0].name,
        });
        console.log('handleAddEntry created entry:', created);
        if (created) {
          setEntries((prev) => [created, ...prev]);
        }
      } else if (regularFiles.length > 0 && cameraPhotos.length === 0) {
        // Only regular files - use regular endpoint
        const created = await createActivityEntry(activityUuid, token, {
          body: newBody.trim() || undefined,
          data: null,
          attachments: regularFiles,
        });
        console.log('handleAddEntry created entry:', created);
        if (created) {
          setEntries((prev) => [created, ...prev]);
        }
      } else if (cameraPhotos.length === 0 && regularFiles.length === 0) {
        // No attachments - use regular endpoint
        const created = await createActivityEntry(activityUuid, token, {
          body: newBody.trim() || undefined,
          data: null,
        });
        console.log('handleAddEntry created entry:', created);
        if (created) {
          setEntries((prev) => [created, ...prev]);
        }
      } else {
        // Mixed types - not supported yet
        Alert.alert('Error', 'Cannot mix camera photos and file attachments in the same entry');
        return;
      }
      
      setNewBody('');
      setSelectedAttachments([]);
    } catch (err) {
      console.error('handleAddEntry error:', err);
      setError('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachFile = async () => {
    setShowAttachModal(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({ allowMultipleSelection: true });
      if (!result.canceled && result.assets.length > 0) {
        setSelectedAttachments((prev) => [...prev, ...result.assets]);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick documents');
    }
  };

  const handleCapturePhoto = async () => {
    setShowAttachModal(false);
    if (!cameraPermission) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission required', 'Camera permission is required to take photos.');
        return;
      }
    }
    setShowCameraModal(true);
  };

  const handleClearAttachment = (index: number) => {
    setSelectedAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteEntry = async (entryUuid: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivityEntry(entryUuid, token);
              setEntries((prev) => prev.filter((e) => e.uuid !== entryUuid));
            } catch (err) {
              console.error('Failed to delete entry:', err);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        // Read the photo as base64
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const dataUri = `data:image/jpeg;base64,${base64}`;
        const fileName = `photo_${Date.now()}.jpg`;
        
        // Add as a camera attachment (base64 format)
        const asset: DocumentPicker.DocumentPickerAsset = {
          uri: dataUri,
          name: fileName,
          mimeType: 'image/jpeg',
          size: undefined,
        };
        setSelectedAttachments((prev) => [...prev, asset]);
        setShowCameraModal(false);
      }
    } catch (err) {
      console.error('Failed to take photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color={primaryTextColor} />
            </TouchableOpacity>
            <View style={styles.titleColumn}>
              <Text style={[styles.headerTitle, { color: primaryColor }]}>{activityTitle ?? 'Activity entries'}</Text>
              <Text style={[styles.headerSubtitle, { color: mutedTextColor }]}>{projectTitle}</Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          <Text style={[styles.status, { color: mutedTextColor }]}>
            {isLoading ? 'Loading entries...' : error ? error : null}
          </Text>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {entries.map((entry) => (
              <TouchableOpacity
                key={entry.uuid}
                style={[styles.entryItem, { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor }]}
                onPress={() => navigation.navigate('ActivityEntryDetail', { entryUuid: entry.uuid })}
              >
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryBody, { color: primaryTextColor }]}>
                    {entry.body || <Text style={[styles.placeholderText, { color: mutedTextColor }]}>No text</Text>}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteEntry(entry.uuid)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.entryDate, { color: secondaryTextColor }]}>
                  {new Date(entry.created_at).toLocaleString()}
                </Text>
                {entry.attachments && entry.attachments.length > 0 && (
                  <View style={styles.attachmentRow}>
                    <MaterialIcons name="attach-file" size={16} color={mutedTextColor} />
                    <Text style={[styles.attachmentCount, { color: mutedTextColor }]}>
                      {entry.attachments.length} attachment{entry.attachments.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {selectedAttachments.map((asset, index) => (
              <View key={index} style={[styles.attachmentPreview, { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor }]}>
                <View style={styles.attachmentRow}>
                  <MaterialIcons name="attach-file" size={20} color={primaryTextColor} />
                  <Text style={[styles.attachmentName, { color: primaryTextColor }]}>{asset.name}</Text>
                  <TouchableOpacity onPress={() => handleClearAttachment(index)}>
                    <MaterialIcons name="close" size={20} color={mutedTextColor} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
                  <Text style={[styles.attachOptionText, { color: primaryTextColor }]}>Attach File/Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.attachOption} onPress={handleCapturePhoto}>
                  <MaterialIcons name="photo-camera" size={24} color={primaryTextColor} />
                  <Text style={[styles.attachOptionText, { color: primaryTextColor }]}>Camera</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Camera Modal */}
          <Modal visible={showCameraModal} animationType="slide">
            <SafeAreaView style={styles.cameraContainer}>
              <CameraView style={styles.camera} facing="back" ref={cameraRef} />
              <View style={styles.cameraOverlay}>
                <TouchableOpacity style={styles.closeCamera} onPress={() => setShowCameraModal(false)}>
                  <MaterialIcons name="close" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                  <View style={styles.captureInner} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleColumn: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    width: 24,
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
  entryItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryBody: {
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  entryDate: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
  },
  attachmentCount: {
    color: '#aaa',
    fontSize: 12,
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
  },
  newEntryContainer: {
    paddingTop: 8,
    paddingBottom: 8,
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeCamera: {
    alignSelf: 'flex-start',
  },
  captureButton: {
    alignSelf: 'flex-end',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
  },
});
