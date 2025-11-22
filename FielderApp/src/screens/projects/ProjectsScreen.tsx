import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth-store';
import { fetchProjects, type ProjectSummary } from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';

export const ProjectsScreen: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigation<any>();
  const {
    primaryColor,
    backgroundColor,
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    cardBackgroundColor,
    borderBaseColor,
  } = useBranding();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProjects(token);
        if (!isMounted) return;
        setProjects(data);
      } catch {
        if (!isMounted) return;
        setError('Failed to load projects');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderBaseColor }]}>
        <Text style={[styles.title, { color: primaryTextColor }]}>Projects</Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Select a project to view its activities.</Text>
      </View>

      <Text style={[styles.status, { color: mutedTextColor }]}>
        {isLoading ? 'Loading projects...' : error ? error : null}
      </Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.uuid}
            style={[
              styles.item,
              { borderColor: borderBaseColor, backgroundColor: cardBackgroundColor },
            ]}
            onPress={() =>
              navigation.navigate('ProjectActivities', {
                projectUuid: project.uuid,
                projectTitle: project.title,
              })
            }
          >
            <Text style={[styles.itemTitle, { color: primaryTextColor }]}>{project.title}</Text>
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
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#ccc',
  },
  status: {
    color: '#ff6b6b',
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  itemTitle: {
    color: '#fff',
  },
});
