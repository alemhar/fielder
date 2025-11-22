import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth-store';
import { fetchProjects, type ProjectSummary } from '../../services/fielder-service';
import { useBranding } from '../../theme/branding';
import { useThemeStore, type ThemeMode } from '../../stores/theme-store';

export const DashboardScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
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
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const load = async () => {
      setIsLoadingProjects(true);
      setProjectsError(null);
      try {
        const data = await fetchProjects(token);
        if (!isMounted) return;
        setProjects(data);
      } catch {
        if (!isMounted) return;
        setProjectsError('Failed to load projects');
      } finally {
        if (!isMounted) return;
        setIsLoadingProjects(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const projectsCount = projects.length;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: primaryTextColor }]}>Fielder Dashboard</Text>
          {user ? (
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Signed in as {user.email}</Text>
          ) : null}
        </View>
        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsMenuOpen((open) => !open)}
          >
            <Text style={[styles.menuButtonText, { color: primaryTextColor }]}>⋮</Text>
          </TouchableOpacity>
          {isMenuOpen && (
            <View
              style={[
                styles.menuContainer,
                { backgroundColor: cardBackgroundColor, borderColor: borderBaseColor },
              ]}
            >
              <Text style={[styles.menuSectionLabel, { color: mutedTextColor }]}>Theme</Text>
              <View style={styles.themeToggleRow}>
                {(['light', 'dark'] as ThemeMode[]).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.themeToggleOption,
                      mode === themeMode && { borderColor: primaryColor },
                    ]}
                    onPress={() => {
                      setThemeMode(mode);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.themeToggleText,
                        { color: mode === themeMode ? primaryColor : primaryTextColor },
                      ]}
                    >
                      {mode === 'light' ? 'Light' : 'Dark'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.placeholder, { color: mutedTextColor }]}>
        {isLoadingProjects
          ? 'Loading projects...'
          : projectsError
          ? projectsError
          : projectsCount === 0
          ? 'No projects found for this tenant.'
          : `You have ${projectsCount} project${projectsCount === 1 ? '' : 's'}.`}
      </Text>

      <ScrollView style={styles.projectsList} contentContainerStyle={styles.projectsListContent}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.uuid}
            style={[
              styles.projectItem,
              { borderColor: borderBaseColor, backgroundColor: cardBackgroundColor },
            ]}
            onPress={() => navigation.navigate('ProjectActivities', {
              projectUuid: project.uuid,
              projectTitle: project.title,
            })}
          >
            <Text style={[styles.projectItemTitle, { color: primaryTextColor }]}>{project.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button title="View all projects" onPress={() => navigation.navigate('Projects')} color={primaryColor} />
    </View>
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ccc',
    marginBottom: 16,
  },
  placeholder: {
    color: '#888',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
  },
  menuContainer: {
    position: 'absolute',
    top: 28,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 140,
    zIndex: 10,
    elevation: 4,
  },
  menuSectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginHorizontal: 12,
    marginBottom: 4,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuItemText: {
    fontSize: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 4,
  },
  themeToggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  themeToggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeToggleText: {
    fontSize: 12,
  },
  projectsList: {
    flex: 1,
    marginBottom: 16,
  },
  projectsListContent: {
    paddingBottom: 16,
  },
  projectItem: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  projectItemTitle: {
    color: '#fff',
  },
  signOutWrapper: {
    marginTop: 12,
  },
});
