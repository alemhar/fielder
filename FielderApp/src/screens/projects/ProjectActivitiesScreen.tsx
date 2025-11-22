import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth-store';
import { fetchProjectActivities, type ActivitySummary } from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';
import { SectionHeader } from '../../components/SectionHeader';

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
      <SectionHeader
        title={projectTitle ?? 'Project activities'}
        subtitle="Select an activity to view its entries."
      />

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
