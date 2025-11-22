import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth-store';
import {
  fetchActivityEntry,
  updateActivityEntry,
  deleteActivityEntryAttachment,
  type ActivityEntryDto,
} from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';
import { SectionHeader } from '../../components/SectionHeader';

export const ActivityEntryDetailScreen: React.FC = () => {
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
  } = useBranding();

  const { entryUuid, activityTitle, projectTitle } = route.params ?? {};

  const [entry, setEntry] = useState<ActivityEntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState('');

  useEffect(() => {
    if (!token || !entryUuid) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchActivityEntry(entryUuid, token);
        if (!isMounted) return;
        setEntry(data);
        setEditedBody(data.body || '');
      } catch {
        if (!isMounted) return;
        setError('Failed to load entry');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [token, entryUuid]);

  const handleSave = async () => {
    if (!token || !entry) return;
    setIsSaving(true);
    try {
      const updated = await updateActivityEntry(entry.uuid, token, {
        body: editedBody.trim() || null,
        data: entry.data,
      });
      setEntry(updated);
      setIsEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAttachment = async (attachmentUuid: string) => {
    if (!token || !entry) return;
    Alert.alert('Delete attachment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteActivityEntryAttachment(entry.uuid, attachmentUuid, token);
            // Refresh entry
            const refreshed = await fetchActivityEntry(entry.uuid, token);
            setEntry(refreshed);
          } catch {
            Alert.alert('Error', 'Failed to delete attachment');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.status, { color: mutedTextColor }]}>Loading entry...</Text>
      </SafeAreaView>
    );
  }

  if (error || !entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.status, { color: '#ef4444' }]}>{error || 'Entry not found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={primaryTextColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: primaryColor }]}>Entry Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {entry.user ? (
          <Text style={[styles.meta, { color: mutedTextColor }]}>
            By {entry.user.email} • {entry.created_at}
          </Text>
        ) : null}

        {isEditing ? (
          <>
            <TextInput
              multiline
              value={editedBody}
              onChangeText={setEditedBody}
              style={[styles.bodyInput, { color: primaryTextColor, borderColor: borderBaseColor }]}
            />
            <View style={styles.editActions}>
              <Button title="Cancel" onPress={() => setIsEditing(false)} color="#6b7280" />
              <Button title={isSaving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={isSaving} color={primaryColor} />
            </View>
          </>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={[styles.body, { color: primaryTextColor }]}>
              {entry.body || <Text style={[styles.placeholderText, { color: mutedTextColor }]}>No text</Text>}
            </Text>
          </TouchableOpacity>
        )}

        {entry.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={[styles.sectionTitle, { color: primaryTextColor }]}>Attachments</Text>
            {entry.attachments.map((att) => (
              <View key={att.uuid} style={[styles.attachmentRow, { borderColor: borderBaseColor }]}>
                <MaterialIcons name="attach-file" size={20} color={primaryTextColor} />
                <Text style={[styles.attachmentName, { color: primaryTextColor }]}>{att.original_name || 'Unnamed'}</Text>
                <TouchableOpacity onPress={() => handleDeleteAttachment(att.uuid)}>
                  <MaterialIcons name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  status: {
    textAlign: 'center',
    marginTop: 32,
  },
  content: {
    flex: 1,
  },
  meta: {
    fontSize: 12,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  placeholderText: {
    fontStyle: 'italic',
  },
  bodyInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  attachmentsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
  },
});
