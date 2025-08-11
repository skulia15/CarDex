import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SpotScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  const handleStartSpotting = () => {
    router.push('/camera');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="viewfinder"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Spot a Car</ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedText style={styles.description}>
            Take a photo of a car you see in the wild and add it to your collection!
          </ThemedText>

          <ThemedView style={styles.features}>
            <ThemedView style={styles.feature}>
              <IconSymbol name="camera.fill" size={24} color={tintColor} />
              <ThemedText style={styles.featureText}>
                Take or choose a photo
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.feature}>
              <IconSymbol name="building.2.fill" size={24} color={tintColor} />
              <ThemedText style={styles.featureText}>
                Select the manufacturer
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.feature}>
              <IconSymbol name="car.fill" size={24} color={tintColor} />
              <ThemedText style={styles.featureText}>
                Choose the car model
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.feature}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="green" />
              <ThemedText style={styles.featureText}>
                Add to your Car-dex!
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: tintColor }]}
            onPress={handleStartSpotting}>
            <IconSymbol name="viewfinder" size={24} color="white" />
            <ThemedText style={styles.startButtonText}>Start Spotting</ThemedText>
          </TouchableOpacity>
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
  titleContainer: {
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 32,
    textAlign: 'center',
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});