// Fallback for using MaterialIcons on Android and web.

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, string>;
type IconSymbolName = string;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'category.fill': 'category',
  'shopping-cart.fill': 'shopping-cart',
  'heart.fill': 'favorite',
  'account-box': 'account-box',
  'search.fill': 'search',
  'close': 'close',
  'filter': 'filter-list',
  'star': 'star',
  'star-half': 'star-half',
  'star-border': 'star-border',
  'chevron-right': 'chevron-right',

  // custom icons are registered through ICON_REGISTRY, not in this mapping.
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;
  const resolvedColor = (color as string) ?? tint;


  return (
    <MaterialIcons
      color={resolvedColor}
      size={size}
      // Resolve a MaterialIcons name:
      // 1. Use explicit mapping (MAPPING[name])
      // 2. Try removing a common suffix like `.fill` and check mapping
      // 3. Fall back to the raw name (some MaterialIcons use the same names)
      name={(() => {
        const mapped = MAPPING[name];
        if (mapped) return mapped as any;
        const withoutFill = (name as string).replace(/\.fill$/, '');
        if (MAPPING[withoutFill]) return MAPPING[withoutFill] as any;
        return withoutFill as any;
      })()}
      style={style}
    />
  );
}
