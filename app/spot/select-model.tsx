import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { Model, Spot } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SelectModelScreen() {
  const router = useRouter();
  const { photoUri, manufacturerId, manufacturerName } = useLocalSearchParams<{
    photoUri: string;
    manufacturerId: string;
    manufacturerName: string;
  }>();
  
  const [models, setModels] = useState<Model[]>([]);
  const [saving, setSaving] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const loadModels = useCallback(async () => {
    if (!manufacturerId) return;

    try {
      const data = await DataService.getModelsByManufacturer(manufacturerId);
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }, [manufacturerId]);

  const handleModelSelect = async (model: Model) => {
    if (!photoUri || saving) return;

    setSaving(true);

    try {
      const user = await DataService.getCurrentUser();
      
      const spot: Spot = {
        id: Date.now().toString(),
        userId: user.id,
        modelId: model.id,
        photoUrl: photoUri,
        createdAt: new Date().toISOString(),
        notes: '',
      };

      await DataService.saveSpot(spot);

      Alert.alert(
        '🎉 Car Spotted!',
        `You caught a ${model.name} by ${manufacturerName}!\n\nIt's been added to your Car-dex.`,
        [
          {
            text: 'Continue Spotting',
            onPress: () => {
              router.dismissAll();
              router.push('/camera');
            },
          },
          {
            text: 'View Car-dex',
            onPress: () => {
              router.dismissAll();
              router.push('/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving spot:', error);
      Alert.alert(
        'Error',
        'Failed to save your spot. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const renderModelItem = ({ item }: { item: Model }) => (
    <TouchableOpacity
      style={[styles.modelCard, { backgroundColor: backgroundColor }]}
      onPress={() => handleModelSelect(item)}
      disabled={saving}>
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.iconContainer}>
          <IconSymbol name="car.fill" size={28} color={tintColor} />
        </ThemedView>
        <ThemedView style={styles.modelInfo}>
          <ThemedText style={styles.modelName}>{item.name}</ThemedText>
          <ThemedText style={styles.modelSlug}>{item.slug}</ThemedText>
        </ThemedView>
        <IconSymbol name="chevron.right" size={20} color={textColor + '60'} />
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
          <ThemedText style={[styles.backText, { color: tintColor }]}>Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Select Model</ThemedText>
      </ThemedView>

      {/* Photo and Manufacturer Info */}
      <ThemedView style={styles.spotInfo}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        )}
        <ThemedView style={styles.manufacturerBadge}>
          <IconSymbol name="building.2.fill" size={16} color={tintColor} />
          <ThemedText style={[styles.manufacturerText, { color: tintColor }]}>
            {manufacturerName}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.instructionText}>
          Which model is this?
        </ThemedText>
      </ThemedView>

      {/* Models List */}
      <FlatList
        data={models}
        renderItem={renderModelItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {saving && (
        <ThemedView style={styles.savingOverlay}>
          <ThemedView style={[styles.savingCard, { backgroundColor }]}>
            <ThemedText style={styles.savingText}>Saving your spot...</ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
  },
  spotInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  previewImage: {
    width: 140,
    height: 105,
    borderRadius: 12,
    marginBottom: 16,
  },
  manufacturerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 12,
    gap: 6,
  },
  manufacturerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modelCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  modelSlug: {
    fontSize: 14,
    opacity: 0.6,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingCard: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  savingText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});