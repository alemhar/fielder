import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBranding } from '../theme/branding';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  const { primaryColor, primaryTextColor, secondaryTextColor, borderBaseColor } = useBranding();

  return (
    <View style={[styles.header, { borderBottomColor: borderBaseColor }]}>
      <Text style={[styles.title, { color: primaryColor }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});
