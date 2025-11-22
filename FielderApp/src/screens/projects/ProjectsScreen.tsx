import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth-store';
import { fetchProjects, type ProjectSummary } from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';
import { SectionHeader } from '../../components/SectionHeader';

export const ProjectsScreen: React.FC = () => {
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={primaryTextColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: primaryTextColor }]}>Projects</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={[styles.status, { color: mutedTextColor }]}>
        {isLoading ? 'Loading projects...' : error ? error : null}
      </Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.uuid}
            style={[styles.projectCard, { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor }]}
            onPress={() =>
              navigation.navigate('ProjectActivities', {
                projectUuid: project.uuid,
                projectTitle: project.title,
              })
            }
          >
            <Text style={[styles.projectTitle, { color: primaryColor }]}>{project.title}</Text>
            <Text style={[styles.projectMeta, { color: mutedTextColor }]}>
              {project.activities_count} activity{project.activities_count === 1 ? '' : 's'}
            </Text>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
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
  projectCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  projectMeta: {
    fontSize: 12,
    marginTop: 4,
  },
});
