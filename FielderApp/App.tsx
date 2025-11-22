import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/stores/auth-store';
import { fetchMe } from './src/services/auth-service';
import { loadAuth, clearAuth } from './src/storage/auth-storage';

export default function App() {
	const setSession = useAuthStore((state) => state.setSession);
	const [isBootstrapping, setIsBootstrapping] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const bootstrap = async () => {
			try {
				const stored = await loadAuth();
				if (stored && stored.token) {
					const { user, company } = await fetchMe(stored.token);
					if (!isMounted) return;
					setSession({ user, company, token: stored.token });
				}
			} catch {
				await clearAuth();
			} finally {
				if (isMounted) {
					setIsBootstrapping(false);
				}
			}
		};

		void bootstrap();

		return () => {
			isMounted = false;
		};
	}, [setSession]);

	if (isBootstrapping) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar style="light" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />
			<AppNavigator />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
