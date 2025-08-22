// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// SF Symbols → Material Icons mapping used on Android/Web
// Reference: https://icons.expo.fyi (MaterialIcons) and Apple's SF Symbols catalog
const MAPPING: Record<string, string> = {
  // Existing mappings
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // App-specific icons
  'chevron.left': 'chevron-left',
  'xmark': 'close',
  'camera.rotate': 'cameraswitch',
  'photo.on.rectangle': 'photo-library',
  'exclamationmark.triangle': 'warning',
  'list.bullet.rectangle': 'list-alt',
  viewfinder: 'center-focus-strong',
  'trophy.fill': 'emoji-events',
  'gearshape.fill': 'settings',
  gear: 'settings',
  'car.fill': 'directions-car',
  'checkmark.circle.fill': 'check-circle',
  circle: 'radio-button-unchecked',
  'building.2.fill': 'apartment',
  'camera.fill': 'photo-camera',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
};

/**
 * An icon component that uses Material Icons on Android and web, mirroring SF Symbol names.
 * Unmapped names fall back to `help-outline` to avoid runtime crashes.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
}) {
  const mapped = MAPPING[name] ?? 'help-outline';
  if (__DEV__ && !MAPPING[name]) {
    // eslint-disable-next-line no-console
    console.warn(`IconSymbol: Unmapped SF Symbol "${name}" → falling back to MaterialIcons:"${mapped}"`);
  }
  return <MaterialIcons color={color as any} size={size} name={mapped as any} style={style} />;
}
