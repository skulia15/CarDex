export interface Manufacturer {
  id: string;
  name: string;
  country: string;
  slug: string;
}

export interface Model {
  id: string;
  manufacturerId: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface Spot {
  id: string;
  userId: string;
  modelId: string;
  photoUrl: string;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface DexEntry {
  userId: string;
  modelId: string;
  status: 'spotted';
  bestPhotoUrl: string;
  firstSpottedAt: string;
}

export interface ModelWithManufacturer extends Model {
  manufacturer: Manufacturer;
}

export interface DexEntryWithModel extends DexEntry {
  model: ModelWithManufacturer;
}