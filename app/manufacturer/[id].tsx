import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { Manufacturer, Model, DexEntry } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ManufacturerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const loadManufacturerData = useCallback(async () => {
    if (!id) return;

    try {
      const [manufacturersData, modelsData, dexData] = await Promise.all([
        DataService.getManufacturers(),
        DataService.getModelsByManufacturer(id),
        DataService.getDexEntries(),
      ]);

      const foundManufacturer = manufacturersData.find(m => m.id === id);
      setManufacturer(foundManufacturer || null);
      setModels(modelsData);
      setDexEntries(dexData);
    } catch (error) {
      console.error('Error loading manufacturer data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadManufacturerData();
  }, [loadManufacturerData]);

  const isModelSpotted = (modelId: string): boolean => {
    return dexEntries.some(entry => entry.modelId === modelId && entry.status === 'spotted');
  };

  const getProgressStats = () => {
    const spotted = models.filter(model => isModelSpotted(model.id)).length;
    const total = models.length;
    const percentage = total > 0 ? Math.round((spotted / total) * 100) : 0;
    return { spotted, total, percentage };
  };

  const renderModelItem = ({ item }: { item: Model }) => {
    const spotted = isModelSpotted(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.modelItem, { backgroundColor: backgroundColor }]}
        onPress={() => router.push(`/model/${item.id}`)}>
        <ThemedView style={styles.modelContent}>
          <ThemedText style={styles.modelName}>{item.name}</ThemedText>
          <ThemedView style={styles.statusContainer}>
            {spotted ? (
              <IconSymbol name="checkmark.circle.fill" size={20} color="green" />
            ) : (
              <IconSymbol name="circle" size={20} color={textColor} />
            )}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading manufacturer...</ThemedText>
      </ThemedView>
    );
  }

  if (!manufacturer) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={tintColor} />
        <ThemedText style={styles.errorText}>Manufacturer not found</ThemedText>
      </ThemedView>
    );
  }

  const progress = getProgressStats();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="building.2.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{manufacturer.name}</ThemedText>
          <ThemedText style={styles.countryText}>{manufacturer.country}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.progressSection}>
          <ThemedText style={styles.progressTitle}>Collection Progress</ThemedText>
          <ThemedView style={styles.progressRow}>
            <ThemedText style={styles.progressText}>
              {progress.spotted} of {progress.total} models spotted
            </ThemedText>
            <ThemedText style={[styles.progressPercentage, { color: tintColor }]}>
              {progress.percentage}%
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.modelsSection}>
          <ThemedText style={styles.sectionTitle}>Models</ThemedText>
          <FlatList
            data={models}
            renderItem={renderModelItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  countryText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modelsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modelItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  modelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 12,
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
});