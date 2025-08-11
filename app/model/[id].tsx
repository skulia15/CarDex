import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { ModelWithManufacturer, DexEntry, Spot } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ModelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [model, setModel] = useState<ModelWithManufacturer | null>(null);
  const [dexEntry, setDexEntry] = useState<DexEntry | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  const tintColor = useThemeColor({}, 'tint');

  const loadModelData = useCallback(async () => {
    if (!id) return;

    try {
      const [modelsData, dexEntries, spotsData] = await Promise.all([
        DataService.getModelsWithManufacturers(),
        DataService.getDexEntries(),
        DataService.getSpotsByModel(id),
      ]);

      const foundModel = modelsData.find(m => m.id === id);
      const foundEntry = dexEntries.find(e => e.modelId === id);

      setModel(foundModel || null);
      setDexEntry(foundEntry || null);
      setSpots(spotsData);
    } catch (error) {
      console.error('Error loading model data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadModelData();
  }, [loadModelData]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading model...</ThemedText>
      </ThemedView>
    );
  }

  if (!model) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={tintColor} />
        <ThemedText style={styles.errorText}>Model not found</ThemedText>
      </ThemedView>
    );
  }

  const isSpotted = !!dexEntry;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="car.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{model.name}</ThemedText>
          <TouchableOpacity
            onPress={() => router.push(`/manufacturer/${model.manufacturer.id}`)}>
            <ThemedText style={[styles.manufacturerLink, { color: tintColor }]}>
              {model.manufacturer.name}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.statusSection}>
          <ThemedView style={styles.statusRow}>
            <ThemedText style={styles.statusLabel}>Status:</ThemedText>
            <ThemedView style={styles.statusValue}>
              {isSpotted ? (
                <>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="green" />
                  <ThemedText style={[styles.spottedText, { color: 'green' }]}>
                    Spotted
                  </ThemedText>
                </>
              ) : (
                <>
                  <IconSymbol name="circle" size={20} color="#999" />
                  <ThemedText style={styles.notSpottedText}>Not Spotted</ThemedText>
                </>
              )}
            </ThemedView>
          </ThemedView>

          {isSpotted && dexEntry && (
            <ThemedView style={styles.statusRow}>
              <ThemedText style={styles.statusLabel}>First spotted:</ThemedText>
              <ThemedText style={styles.dateText}>
                {new Date(dexEntry.firstSpottedAt).toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {isSpotted && spots.length > 0 && (
          <ThemedView style={styles.spotsSection}>
            <ThemedText style={styles.spotsTitle}>Your Spots ({spots.length})</ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spotsContainer}>
              {spots.map((spot, index) => (
                <ThemedView key={spot.id} style={styles.spotItem}>
                  <Image source={{ uri: spot.photoUrl }} style={styles.spotImage} />
                  <ThemedText style={styles.spotDate}>
                    {new Date(spot.createdAt).toLocaleDateString()}
                  </ThemedText>
                  {index === 0 && (
                    <ThemedView style={styles.firstSpotBadge}>
                      <ThemedText style={styles.firstSpotText}>First</ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>
        )}

        <ThemedView style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.spotButton, { backgroundColor: tintColor }]}
            onPress={() => router.push('/camera')}>
            <IconSymbol name="camera.fill" size={20} color="white" />
            <ThemedText style={styles.spotButtonText}>
              {isSpotted ? 'Add Another Spot' : 'Spot This Car'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 24,
  },
  manufacturerLink: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  statusSection: {
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spottedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notSpottedText: {
    fontSize: 16,
    color: '#999',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  actionSection: {
    marginTop: 20,
  },
  spotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  spotButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  errorText: {
    marginTop: 12,
    opacity: 0.7,
    fontSize: 16,
  },
  spotsSection: {
    marginBottom: 32,
  },
  spotsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  spotsContainer: {
    paddingRight: 20,
  },
  spotItem: {
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  spotImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  spotDate: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  firstSpotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'gold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  firstSpotText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
});