import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth-store';
import { fetchProjectActivities, type ActivitySummary } from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';

export const ProjectActivitiesScreen: React.FC = () => {
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

  const { projectUuid, projectTitle } = route.params ?? {};

  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !projectUuid) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProjectActivities(projectUuid, token);
        if (!isMounted) return;
        setActivities(data);
      } catch {
        if (!isMounted) return;
        setError('Failed to load activities');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [token, projectUuid]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={primaryTextColor} />
        </TouchableOpacity>
        <View style={styles.titleColumn}>
          <Text style={[styles.headerTitle, { color: primaryColor }]}>
            {projectTitle ?? 'Project activities'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: mutedTextColor }]}>
            Select an activity to view its entries.
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <Text style={[styles.status, { color: mutedTextColor }]}>
        {isLoading ? 'Loading activities...' : error ? error : null}
      </Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.uuid}
            style={[
              styles.item,
              { borderColor: borderBaseColor, backgroundColor: cardBackgroundColor },
            ]}
            onPress={() =>
              navigation.navigate('ActivityEntries', {
                activityUuid: activity.uuid,
                activityTitle: activity.title,
                projectTitle: projectTitle ?? '',
              })
            }
          >
            <Text style={[styles.itemTitle, { color: primaryTextColor }]}>{activity.title}</Text>
            {activity.type ? (
              <Text style={[styles.itemMeta, { color: mutedTextColor }]}>{activity.type}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 32,
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
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  itemTitle: {
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
  },
});
