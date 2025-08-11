import AsyncStorage from '@react-native-async-storage/async-storage';
import { Manufacturer, Model, ModelWithManufacturer, Spot, DexEntry, User } from '@/types';

// Sample manufacturers
export const MANUFACTURERS: Manufacturer[] = [
  { id: '1', name: 'Toyota', country: 'JP', slug: 'toyota' },
  { id: '2', name: 'Honda', country: 'JP', slug: 'honda' },
  { id: '3', name: 'BMW', country: 'DE', slug: 'bmw' },
  { id: '4', name: 'Mercedes-Benz', country: 'DE', slug: 'mercedes-benz' },
  { id: '5', name: 'Ford', country: 'US', slug: 'ford' },
  { id: '6', name: 'Chevrolet', country: 'US', slug: 'chevrolet' },
  { id: '7', name: 'Volkswagen', country: 'DE', slug: 'volkswagen' },
  { id: '8', name: 'Nissan', country: 'JP', slug: 'nissan' },
  { id: '9', name: 'Hyundai', country: 'KR', slug: 'hyundai' },
  { id: '10', name: 'Kia', country: 'KR', slug: 'kia' },
];

// Sample models
export const MODELS: Model[] = [
  // Toyota models
  { id: '1', manufacturerId: '1', name: 'Corolla', slug: 'corolla' },
  { id: '2', manufacturerId: '1', name: 'Camry', slug: 'camry' },
  { id: '3', manufacturerId: '1', name: 'Prius', slug: 'prius' },
  { id: '4', manufacturerId: '1', name: 'RAV4', slug: 'rav4' },
  
  // Honda models
  { id: '5', manufacturerId: '2', name: 'Civic', slug: 'civic' },
  { id: '6', manufacturerId: '2', name: 'Accord', slug: 'accord' },
  { id: '7', manufacturerId: '2', name: 'CR-V', slug: 'cr-v' },
  { id: '8', manufacturerId: '2', name: 'Pilot', slug: 'pilot' },
  
  // BMW models
  { id: '9', manufacturerId: '3', name: '3 Series', slug: '3-series' },
  { id: '10', manufacturerId: '3', name: '5 Series', slug: '5-series' },
  { id: '11', manufacturerId: '3', name: 'X3', slug: 'x3' },
  { id: '12', manufacturerId: '3', name: 'X5', slug: 'x5' },
  
  // Mercedes-Benz models
  { id: '13', manufacturerId: '4', name: 'C-Class', slug: 'c-class' },
  { id: '14', manufacturerId: '4', name: 'E-Class', slug: 'e-class' },
  { id: '15', manufacturerId: '4', name: 'GLE', slug: 'gle' },
  { id: '16', manufacturerId: '4', name: 'GLC', slug: 'glc' },
  
  // Ford models
  { id: '17', manufacturerId: '5', name: 'F-150', slug: 'f-150' },
  { id: '18', manufacturerId: '5', name: 'Mustang', slug: 'mustang' },
  { id: '19', manufacturerId: '5', name: 'Explorer', slug: 'explorer' },
  { id: '20', manufacturerId: '5', name: 'Escape', slug: 'escape' },
];

// Storage keys
const STORAGE_KEYS = {
  USER: '@carpokemon:user',
  SPOTS: '@carpokemon:spots',
  DEX_ENTRIES: '@carpokemon:dex_entries',
} as const;

// Mock current user
const CURRENT_USER: User = {
  id: 'user-1',
  displayName: 'Car Spotter',
  email: 'spotter@carpokemon.com',
};

// Data service
export class DataService {
  static async getManufacturers(): Promise<Manufacturer[]> {
    return MANUFACTURERS;
  }

  static async getModels(): Promise<Model[]> {
    return MODELS;
  }

  static async getModelsWithManufacturers(): Promise<ModelWithManufacturer[]> {
    const models = await this.getModels();
    const manufacturers = await this.getManufacturers();
    
    return models.map(model => ({
      ...model,
      manufacturer: manufacturers.find(m => m.id === model.manufacturerId)!,
    }));
  }

  static async getModelsByManufacturer(manufacturerId: string): Promise<Model[]> {
    const models = await this.getModels();
    return models.filter(model => model.manufacturerId === manufacturerId);
  }

  static async searchModels(query: string): Promise<ModelWithManufacturer[]> {
    const modelsWithManufacturers = await this.getModelsWithManufacturers();
    const lowerQuery = query.toLowerCase();
    
    return modelsWithManufacturers.filter(model =>
      model.name.toLowerCase().includes(lowerQuery) ||
      model.manufacturer.name.toLowerCase().includes(lowerQuery)
    );
  }

  static async getCurrentUser(): Promise<User> {
    return CURRENT_USER;
  }

  static async getSpots(): Promise<Spot[]> {
    try {
      const spots = await AsyncStorage.getItem(STORAGE_KEYS.SPOTS);
      return spots ? JSON.parse(spots) : [];
    } catch (error) {
      console.error('Error loading spots:', error);
      return [];
    }
  }

  static async saveSpot(spot: Spot): Promise<void> {
    try {
      const spots = await this.getSpots();
      const updatedSpots = [...spots, spot];
      await AsyncStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(updatedSpots));
      
      // Create or update DexEntry
      await this.createOrUpdateDexEntry(spot);
    } catch (error) {
      console.error('Error saving spot:', error);
      throw error;
    }
  }

  static async createOrUpdateDexEntry(spot: Spot): Promise<void> {
    try {
      const entries = await this.getDexEntries();
      const existingIndex = entries.findIndex(
        entry => entry.userId === spot.userId && entry.modelId === spot.modelId
      );

      const dexEntry: DexEntry = {
        userId: spot.userId,
        modelId: spot.modelId,
        status: 'spotted',
        bestPhotoUrl: spot.photoUrl,
        firstSpottedAt: existingIndex >= 0 ? entries[existingIndex].firstSpottedAt : spot.createdAt,
      };

      if (existingIndex >= 0) {
        entries[existingIndex] = dexEntry;
      } else {
        entries.push(dexEntry);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.DEX_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error creating/updating dex entry:', error);
      throw error;
    }
  }

  static async getDexEntries(): Promise<DexEntry[]> {
    try {
      const entries = await AsyncStorage.getItem(STORAGE_KEYS.DEX_ENTRIES);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error loading dex entries:', error);
      return [];
    }
  }

  static async saveDexEntry(entry: DexEntry): Promise<void> {
    try {
      const entries = await this.getDexEntries();
      const existingIndex = entries.findIndex(
        e => e.userId === entry.userId && e.modelId === entry.modelId
      );
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.DEX_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving dex entry:', error);
      throw error;
    }
  }

  static async getUserProgress(): Promise<{ spotted: number; total: number; percentage: number }> {
    const models = await this.getModels();
    const entries = await this.getDexEntries();
    const user = await this.getCurrentUser();
    
    const userEntries = entries.filter(entry => entry.userId === user.id);
    const spotted = userEntries.length;
    const total = models.length;
    const percentage = total > 0 ? Math.round((spotted / total) * 100) : 0;
    
    return { spotted, total, percentage };
  }

  static async getSpotsByModel(modelId: string, userId?: string): Promise<Spot[]> {
    try {
      const spots = await this.getSpots();
      const user = userId ? { id: userId } : await this.getCurrentUser();
      
      return spots.filter(spot => 
        spot.modelId === modelId && spot.userId === user.id
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting spots by model:', error);
      return [];
    }
  }
}