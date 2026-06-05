import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { clearLastBranch } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const AVAILABILITY_LABEL = {
  AVAILABLE:    { label: 'In Stock',      bg: '#dcfce7', text: '#15803d' },
  LIMITED:      { label: 'Limited Stock', bg: '#fef9c3', text: '#a16207' },
  OUT_OF_STOCK: { label: 'Out of Stock',  bg: '#fee2e2', text: '#b91c1c' },
};

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const { product, branch, store } = result;

  const avail = AVAILABILITY_LABEL[product.availability];
  const imageUri = product.images[0]?.url ?? product.image_url;
  const discount = product.offer_price
    ? Math.round(((product.mrp - product.offer_price) / product.mrp) * 100)
    : product.selling_price < product.mrp
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : null;
  const finalPrice = product.offer_price ?? product.selling_price;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Store / branch info */}
      <Text style={styles.storeLine}>{store} · {branch}</Text>

      {/* Product image */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      {/* Name + brand */}
      <Text style={styles.name}>{product.name}</Text>
      {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
      {product.weight_volume ? (
        <Text style={styles.meta}>{product.weight_volume}</Text>
      ) : null}

      {/* Availability badge */}
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

      {/* Extra details */}
      {product.category ? <Detail label="Category" value={product.category} /> : null}
      {product.sku ? <Detail label="SKU" value={product.sku} /> : null}
      {product.ingredients ? <Detail label="Ingredients" value={product.ingredients} /> : null}
      {product.allergens ? <Detail label="Allergens" value={product.allergens} /> : null}
      {product.storage_instructions ? (
        <Detail label="Storage" value={product.storage_instructions} />
      ) : null}
      {product.shelf_life ? <Detail label="Shelf Life" value={product.shelf_life} /> : null}

      {/* Scan again */}
      <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.scanBtnText}>Scan Another Product</Text>
      </TouchableOpacity>

      {/* Change store */}
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
  content: { padding: 20, paddingBottom: 40 },

  storeLine: { fontSize: 12, color: '#6b7280', marginBottom: 12 },

  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  imagePlaceholder: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: { color: '#9ca3af', fontSize: 14 },

  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  brand: { fontSize: 15, color: '#6b7280', marginBottom: 2 },
  meta: { fontSize: 13, color: '#9ca3af', marginBottom: 12 },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: { fontSize: 13, fontWeight: '600' },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  finalPrice: { fontSize: 28, fontWeight: '800', color: '#111827' },
  mrp: { fontSize: 15, color: '#9ca3af', textDecorationLine: 'line-through' },
  discountBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { fontSize: 13, fontWeight: '700', color: '#15803d' },

  detail: { marginBottom: 14 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#374151', lineHeight: 20 },

  scanBtn: {
    marginTop: 24,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  changeStoreBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
  changeStoreText: { color: '#9ca3af', fontSize: 14 },
});
