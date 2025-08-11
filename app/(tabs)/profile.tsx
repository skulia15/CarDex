import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProfileScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({ spotted: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progressData = await DataService.getUserProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="trophy.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">My Collection</ThemedText>
        </ThemedView>

        {!loading && (
          <ThemedView style={styles.progressSection}>
            <ThemedView style={[styles.progressCard, { backgroundColor: backgroundColor }]}>
              <ThemedText style={styles.progressTitle}>Collection Progress</ThemedText>
              
              {/* Progress Bar */}
              <ThemedView style={styles.progressBarContainer}>
                <ThemedView style={[styles.progressBarBg, { backgroundColor: tintColor + '20' }]}>
                  <ThemedView 
                    style={[
                      styles.progressBarFill, 
                      { 
                        backgroundColor: tintColor,
                        width: `${progress.percentage}%`
                      }
                    ]} 
                  />
                </ThemedView>
                <ThemedText style={[styles.progressPercentage, { color: tintColor }]}>
                  {progress.percentage}%
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.progressStats}>
                <ThemedView style={styles.statItem}>
                  <ThemedText style={[styles.statNumber, { color: tintColor }]}>
                    {progress.spotted}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Spotted</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statDivider} />
                <ThemedView style={styles.statItem}>
                  <ThemedText style={styles.statNumber}>
                    {progress.total}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Total</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statDivider} />
                <ThemedView style={styles.statItem}>
                  <ThemedText style={[styles.statNumber, { color: 'green' }]}>
                    {progress.total - progress.spotted}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Missing</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={styles.quickActions}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: backgroundColor }]}
            onPress={() => router.push('/(tabs)')}>
            <IconSymbol name="list.bullet.rectangle" size={24} color={tintColor} />
            <ThemedView style={styles.actionContent}>
              <ThemedText style={styles.actionTitle}>Browse Car-dex</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Explore all available car models
              </ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={tintColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: backgroundColor }]}
            onPress={() => router.push('/(tabs)/spot')}>
            <IconSymbol name="viewfinder" size={24} color={tintColor} />
            <ThemedView style={styles.actionContent}>
              <ThemedText style={styles.actionTitle}>Spot a Car</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Add a new car to your collection
              </ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={tintColor} />
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
  header: {
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  quickActions: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});