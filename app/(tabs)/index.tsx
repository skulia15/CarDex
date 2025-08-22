import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { ModelWithManufacturer, DexEntry } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function DexScreen() {
  const [models, setModels] = useState<ModelWithManufacturer[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelWithManufacturer[]>([]);
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'spotted' | 'unspotted'>('all');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ spotted: 0, total: 0, percentage: 0 });
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const isModelSpotted = useCallback((modelId: string): boolean => {
    return dexEntries.some(entry => entry.modelId === modelId && entry.status === 'spotted');
  }, [dexEntries]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = models;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterMode === 'spotted') {
      filtered = filtered.filter(model => isModelSpotted(model.id));
    } else if (filterMode === 'unspotted') {
      filtered = filtered.filter(model => !isModelSpotted(model.id));
    }

    setFilteredModels(filtered);
  }, [searchQuery, models, filterMode, isModelSpotted]);

  const loadData = async () => {
    try {
      const [modelsData, dexData, progressData] = await Promise.all([
        DataService.getModelsWithManufacturers(),
        DataService.getDexEntries(),
        DataService.getUserProgress(),
      ]);
      setModels(modelsData);
      setDexEntries(dexData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderModelItem = ({ item }: { item: ModelWithManufacturer }) => {
    const spotted = isModelSpotted(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.dexCard, { 
          backgroundColor: spotted ? '#e8f5e8' : backgroundColor,
          borderColor: spotted ? 'green' : tintColor + '30'
        }]}
        onPress={() => router.push(`/model/${item.id}`)}>
        <ThemedView style={styles.cardHeader}>
          <ThemedView style={styles.statusIndicator}>
            {spotted ? (
              <IconSymbol name="checkmark.circle.fill" size={20} color="green" />
            ) : (
              <IconSymbol name="circle" size={20} color="#ccc" />
            )}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.carIconContainer}>
          <IconSymbol 
            name="car.fill" 
            size={40} 
            color={spotted ? 'green' : tintColor} 
            style={styles.carIcon}
          />
        </ThemedView>
        
        <ThemedView style={styles.cardContent}>
          <ThemedText style={[styles.modelName, { 
            color: spotted ? '#2d5a2d' : textColor 
          }]} numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.manufacturerName, {
            color: spotted ? '#4a7c4a' : textColor + '80'
          }]} numberOfLines={1}>
            {item.manufacturer.name}
          </ThemedText>
        </ThemedView>
        
        {spotted && (
          <ThemedView style={styles.spottedBadge}>
            <ThemedText style={styles.spottedText}>SPOTTED</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading Car-dex...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>Car-dex</ThemedText>
          <ThemedView style={[styles.progressBadge, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.progressBadgeText}>
              {progress.spotted}/{progress.total}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TextInput
          style={[styles.searchInput, { color: textColor, borderColor: tintColor }]}
          placeholder="Search cars..."
          placeholderTextColor={textColor + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ThemedView style={styles.filterContainer}>
          {(['all', 'spotted', 'unspotted'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: filterMode === filter ? tintColor : backgroundColor,
                  borderColor: tintColor,
                }
              ]}
              onPress={() => setFilterMode(filter)}>
              <ThemedText style={[
                styles.filterChipText,
                { color: filterMode === filter ? 'white' : tintColor }
              ]}>
                {filter === 'all' ? 'All' : filter === 'spotted' ? 'Spotted' : 'Missing'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
      
      <FlatList
        data={filteredModels}
        renderItem={renderModelItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  gridContainer: {
    padding: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dexCard: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statusIndicator: {
    alignItems: 'center',
  },
  carIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carIcon: {
    marginBottom: 8,
  },
  cardContent: {
    alignItems: 'center',
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  manufacturerName: {
    fontSize: 12,
    textAlign: 'center',
  },
  spottedBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: 'green',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
  },
  spottedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
});
