import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../stores/auth-store';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { ProjectActivitiesScreen } from '../screens/projects/ProjectActivitiesScreen';
import { ActivityEntriesScreen } from '../screens/activities/ActivityEntriesScreen';
import { ActivityEntryDetailScreen } from '../screens/activities/ActivityEntryDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Projects: undefined;
  ProjectActivities: { projectUuid: string; projectTitle: string };
  ActivityEntries: { activityUuid: string; activityTitle: string; projectTitle: string };
  ActivityEntryDetail: { entryUuid: string; activityTitle: string; projectTitle: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Projects" component={ProjectsScreen} />
            <Stack.Screen name="ProjectActivities" component={ProjectActivitiesScreen} />
            <Stack.Screen name="ActivityEntries" component={ActivityEntriesScreen} />
            <Stack.Screen name="ActivityEntryDetail" component={ActivityEntryDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
