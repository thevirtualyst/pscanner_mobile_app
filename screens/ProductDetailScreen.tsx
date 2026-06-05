import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { clearLastBranch } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const AVAILABILITY_LABEL = {
  AVAILABLE:    { label: 'In Stock',      bg: '#dcfce7', text: '#15803d' },
  LIMITED:      { label: 'Limited Stock', bg: '#fef9c3', text: '#a16207' },
  OUT_OF_STOCK: { label: 'Out of Stock',  bg: '#fee2e2', text: '#b91c1c' },
};

// Handles both { label: value } objects and [{ name, value, unit }] arrays
function parseNutrition(json: string | null): Array<{ label: string; value: string }> {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        label: String(item.name ?? item.label ?? ''),
        value: item.unit ? `${item.value} ${item.unit}` : String(item.value ?? ''),
      }));
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed).map(([label, value]) => ({
        label,
        value: String(value),
      }));
    }
  } catch {}
  return [];
}

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const { product, branch, store } = result;
  const { width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeImg, setActiveImg] = useState(0);

  const avail = AVAILABILITY_LABEL[product.availability];
  const discount = product.offer_price
    ? Math.round(((product.mrp - product.offer_price) / product.mrp) * 100)
    : product.selling_price < product.mrp
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : null;
  const finalPrice = product.offer_price ?? product.selling_price;
  const nutrition = parseNutrition(product.nutrition_json);

  // Build image list — prefer images array, fall back to image_url
  const images: string[] =
    product.images.length > 0
      ? product.images.map(i => i.url)
      : product.image_url
      ? [product.image_url]
      : [];

  return (
    <View style={styles.screen}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 16 }]}>
      {/* Store / branch */}
      <Text style={styles.storeLine}>{store} · {branch}</Text>

      {/* ── Image gallery ── */}
      {images.length > 0 ? (
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / screenW);
              setActiveImg(idx);
            }}
            style={{ width: screenW, marginHorizontal: -20 }}
          >
            {images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={[styles.galleryImage, { width: screenW }]}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeImg && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      {/* Name + brand */}
      <Text style={styles.name}>{product.name}</Text>
      {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
      {product.weight_volume ? <Text style={styles.meta}>{product.weight_volume}</Text> : null}

      {/* Availability */}
      <View style={[styles.badge, { backgroundColor: avail.bg }]}>
        <Text style={[styles.badgeText, { color: avail.text }]}>{avail.label}</Text>
      </View>

      {/* Pricing */}
      <View style={styles.priceRow}>
        <Text style={styles.finalPrice}>₹{finalPrice.toFixed(2)}</Text>
        {finalPrice < product.mrp && (
          <Text style={styles.mrp}>MRP ₹{product.mrp.toFixed(2)}</Text>
        )}
        {discount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% off</Text>
          </View>
        ) : null}
      </View>

      {/* ── Nutrition facts table ── */}
      {nutrition.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          {product.serving_size ? (
            <Text style={styles.servingSize}>Per {product.serving_size}</Text>
          ) : null}
          <View style={styles.nutritionTable}>
            {nutrition.map((row, i) => (
              <View
                key={i}
                style={[styles.nutritionRow, i % 2 === 1 && styles.nutritionRowAlt]}
              >
                <Text style={styles.nutritionLabel}>{row.label}</Text>
                <Text style={styles.nutritionValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Ingredients */}
      {product.ingredients ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.sectionBody}>{product.ingredients}</Text>
        </View>
      ) : null}

      {/* Allergens */}
      {product.allergens ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergens</Text>
          <Text style={styles.sectionBody}>{product.allergens}</Text>
        </View>
      ) : null}

      {/* Other details */}
      {product.storage_instructions ? (
        <Detail label="Storage" value={product.storage_instructions} />
      ) : null}
      {product.shelf_life ? <Detail label="Shelf Life" value={product.shelf_life} /> : null}
      {product.category ? <Detail label="Category" value={product.category} /> : null}
      {product.sku ? <Detail label="SKU" value={product.sku} /> : null}

      {/* Change store — stays in scroll so it doesn't crowd the footer */}
      <TouchableOpacity
        style={styles.changeStoreBtn}
        onPress={async () => {
          await clearLastBranch();
          navigation.reset({ index: 0, routes: [{ name: 'StoreList' }] });
        }}
      >
        <Text style={styles.changeStoreText}>Change Store / Branch</Text>
      </TouchableOpacity>
    </ScrollView>

    {/* ── Sticky footer — always visible ── */}
    <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
      <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.scanBtnText}>Scan Another Product</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  storeLine: { fontSize: 12, color: '#6b7280', marginBottom: 12 },

  // Gallery
  galleryWrap: { marginBottom: 16 },
  galleryImage: { height: 240 },
  imagePlaceholder: {
    width: '100%', height: 200, borderRadius: 12, marginBottom: 16,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderText: { color: '#9ca3af', fontSize: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#d1d5db' },
  dotActive: { backgroundColor: '#16a34a', width: 18 },

  // Info
  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4, marginTop: 4 },
  brand: { fontSize: 15, color: '#6b7280', marginBottom: 2 },
  meta: { fontSize: 13, color: '#9ca3af', marginBottom: 12 },

  badge: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, marginBottom: 16,
  },
  badgeText: { fontSize: 13, fontWeight: '600' },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  finalPrice: { fontSize: 28, fontWeight: '800', color: '#111827' },
  mrp: { fontSize: 15, color: '#9ca3af', textDecorationLine: 'line-through' },
  discountBadge: {
    backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  discountText: { fontSize: 13, fontWeight: '700', color: '#15803d' },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 },
  sectionBody: { fontSize: 14, color: '#374151', lineHeight: 21 },
  servingSize: { fontSize: 12, color: '#6b7280', marginBottom: 8 },

  // Nutrition table
  nutritionTable: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  nutritionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 9, paddingHorizontal: 12, backgroundColor: '#fff',
  },
  nutritionRowAlt: { backgroundColor: '#f9fafb' },
  nutritionLabel: { fontSize: 13, color: '#374151', flex: 1 },
  nutritionValue: { fontSize: 13, fontWeight: '600', color: '#111827' },

  // Other details
  detail: { marginBottom: 14 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#374151', lineHeight: 20 },

  // Actions
  scanBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  changeStoreBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
  changeStoreText: { color: '#9ca3af', fontSize: 14 },
});
