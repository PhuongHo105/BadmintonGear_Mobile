import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

type IconMapping = Record<string, string>;
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
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'] | string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;
  const resolvedColor = color ?? tint;


  // If name looks like a SF Symbol we can try SymbolView. Otherwise fall back
  // to MaterialIcons using the same mapping logic used on Android/web.
  const looksLikeSFSymbol = typeof name === 'string' && /^[a-z0-9.\-]+$/.test(name as string) && !name.includes(' ');

  // Try SymbolView first for known SF-like names. If the symbol is not
  // available on the device, the developer can add a mapping below.
  try {
    if (looksLikeSFSymbol && MAPPING[name as string] === undefined) {
      return (
        <SymbolView
          weight={weight}
          tintColor={resolvedColor}
          resizeMode="scaleAspectFit"
          name={name as any}
          style={[
            {
              width: size,
              height: size,
            },
            style,
          ]}
        />
      );
    }
  } catch (e) {
    // fall through to MaterialIcons fallback
  }

  // MaterialIcons fallback (map SF-like names to Material Icons)
  const resolvedName = (() => {
    const mapped = MAPPING[name as string];
    if (mapped) return mapped as any;
    const withoutFill = (name as string).replace(/\.fill$/, '');
    if (MAPPING[withoutFill]) return MAPPING[withoutFill] as any;
    return withoutFill as any;
  })();

  return <MaterialIcons color={resolvedColor} size={size} name={resolvedName} style={style as any} />;
}
