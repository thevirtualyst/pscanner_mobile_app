import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
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

  useEffect(() => {
    fetch(`${API_URL}/api/public/stores`)
      .then(r => r.json())
      .then(data => setStores(data.stores ?? []))
      .catch(() => setError('Could not load stores. Check your connection.'))
      .finally(() => setLoading(false));
  }, []);

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
      data={stores}
      keyExtractor={item => item.slug}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  branchCount: {
    fontSize: 14,
    color: '#6b7280',
  },
});
