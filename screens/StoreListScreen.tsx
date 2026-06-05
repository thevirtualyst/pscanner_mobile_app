import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Store } from '../types';

const API_URL = 'https://www.vmart.thevirtualyst.com';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreList'>;

export default function StoreListScreen({ navigation }: Props) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/public/stores`)
      .then(r => r.json())
      .then(data => setStores(data.stores ?? []))
      .catch(() => setError('Could not load stores. Check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(s => s.name.toLowerCase().includes(q));
  }, [stores, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={item => item.slug}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores…"
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>
      }
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No stores match "{query}"</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('BranchList', { store: item })}
          activeOpacity={0.7}
        >
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.branchCount}>
            {item.branches.length} {item.branches.length === 1 ? 'branch' : 'branches'}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#dc2626', fontSize: 15, textAlign: 'center', paddingHorizontal: 24 },
  list: { padding: 16 },
  searchWrap: { marginBottom: 12 },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  separator: { height: 1, backgroundColor: '#e5e7eb' },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeName: { fontSize: 17, fontWeight: '600', color: '#111827' },
  branchCount: { fontSize: 14, color: '#6b7280' },
  empty: { paddingTop: 32, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9ca3af' },
});
