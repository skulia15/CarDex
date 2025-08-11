import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const themeOptions: { mode: ThemeMode; label: string; icon: string; description: string }[] = [
    {
      mode: 'auto',
      label: 'Auto',
      icon: 'gear',
      description: 'Follow system setting'
    },
    {
      mode: 'light',
      label: 'Light',
      icon: 'sun.max.fill',
      description: 'Always use light theme'
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: 'moon.fill',
      description: 'Always use dark theme'
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    Alert.alert(
      'Theme Changed',
      `Theme has been set to ${mode === 'auto' ? 'Auto (System)' : mode === 'light' ? 'Light' : 'Dark'} mode.`,
      [{ text: 'OK' }]
    );
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gearshape.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Choose how CarPokemon looks on your device
          </ThemedText>

          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.themeOption,
                { 
                  backgroundColor: backgroundColor,
                  borderColor: themeMode === option.mode ? tintColor : textColor + '30'
                }
              ]}
              onPress={() => handleThemeChange(option.mode)}>
              <ThemedView style={styles.themeContent}>
                <ThemedView style={styles.themeIcon}>
                  <IconSymbol 
                    name={option.icon} 
                    size={24} 
                    color={themeMode === option.mode ? tintColor : textColor} 
                  />
                </ThemedView>
                <ThemedView style={styles.themeInfo}>
                  <ThemedText style={[
                    styles.themeLabel,
                    { color: themeMode === option.mode ? tintColor : textColor }
                  ]}>
                    {option.label}
                  </ThemedText>
                  <ThemedText style={[
                    styles.themeDescription,
                    { color: themeMode === option.mode ? tintColor + '80' : textColor + '60' }
                  ]}>
                    {option.description}
                  </ThemedText>
                </ThemedView>
                {themeMode === option.mode && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
                )}
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedView style={[styles.infoCard, { backgroundColor: backgroundColor }]}>
            <ThemedText style={styles.appName}>CarPokemon</ThemedText>
            <ThemedText style={styles.appVersion}>Version 1.0.0</ThemedText>
            <ThemedText style={styles.appDescription}>
              Gotta catch &apos;em all! Spot cars in the wild and build your ultimate car collection.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  themeOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginRight: 16,
  },
  themeInfo: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});