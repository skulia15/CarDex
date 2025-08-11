import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DataService } from '@/services/data';
import { Manufacturer } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SelectManufacturerScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    loadManufacturers();
  }, []);

  const loadManufacturers = async () => {
    try {
      const data = await DataService.getManufacturers();
      setManufacturers(data);
    } catch (error) {
      console.error('Error loading manufacturers:', error);
    }
  };

  const handleManufacturerSelect = (manufacturer: Manufacturer) => {
    router.push({
      pathname: '/spot/select-model',
      params: {
        photoUri,
        manufacturerId: manufacturer.id,
        manufacturerName: manufacturer.name,
      },
    });
  };

  const renderManufacturerItem = ({ item }: { item: Manufacturer }) => (
    <TouchableOpacity
      style={[styles.manufacturerCard, { backgroundColor: backgroundColor }]}
      onPress={() => handleManufacturerSelect(item)}>
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.iconContainer}>
          <IconSymbol name="building.2.fill" size={32} color={tintColor} />
        </ThemedView>
        <ThemedView style={styles.manufacturerInfo}>
          <ThemedText style={styles.manufacturerName}>{item.name}</ThemedText>
          <ThemedText style={styles.manufacturerCountry}>{item.country}</ThemedText>
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
        <ThemedText type="title" style={styles.title}>Select Manufacturer</ThemedText>
      </ThemedView>

      {/* Photo Preview */}
      {photoUri && (
        <ThemedView style={styles.photoPreview}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <ThemedText style={styles.previewText}>Which manufacturer made this car?</ThemedText>
        </ThemedView>
      )}

      {/* Manufacturers List */}
      <FlatList
        data={manufacturers}
        renderItem={renderManufacturerItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  photoPreview: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  previewImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewText: {
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
  manufacturerCard: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  manufacturerInfo: {
    flex: 1,
  },
  manufacturerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  manufacturerCountry: {
    fontSize: 14,
    opacity: 0.7,
  },
});