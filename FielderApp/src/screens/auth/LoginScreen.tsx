import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth-store';
import { useBranding } from '../../theme/branding';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('user@synnch.au');
  const [password, setPassword] = useState('password');

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const {
    primaryColor,
    backgroundColor,
    primaryTextColor,
    inputBackgroundColor,
    borderBaseColor,
    currentLogoUrl,
  } = useBranding();

  const handleSubmit = () => {
    login(email.trim(), password);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {currentLogoUrl ? (
        <Image source={{ uri: currentLogoUrl }} style={styles.logo} resizeMode="contain" />
      ) : null}
      <Text style={[styles.title, { color: primaryTextColor }]}>Fielder Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={[
          styles.input,
          { backgroundColor: inputBackgroundColor, borderColor: borderBaseColor, color: primaryTextColor },
        ]}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={[
          styles.input,
          { backgroundColor: inputBackgroundColor, borderColor: borderBaseColor, color: primaryTextColor },
        ]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={isLoading ? 'Signing in...' : 'Sign in'}
        onPress={handleSubmit}
        color={primaryColor}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 12,
  },
  logo: {
    width: 160,
    height: 60,
    alignSelf: 'center',
    marginBottom: 24,
  },
});
