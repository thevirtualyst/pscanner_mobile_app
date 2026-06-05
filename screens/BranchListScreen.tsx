import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Branch, RootStackParamList } from '../types';
import { saveLastBranch } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'BranchList'>;

export default function BranchListScreen({ route, navigation }: Props) {
  const { store } = route.params;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.branches;
    return store.branches.filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        (b.address ?? '').toLowerCase().includes(q),
    );
  }, [store.branches, query]);

  async function handleSelect(branch: Branch) {
    const params = { branchId: branch.id, branchName: branch.name, storeName: store.name };
    await saveLastBranch(params);
    navigation.navigate('BranchHome', { ...params, branchAddress: branch.address });
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={item => item.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search branches…"
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
          <Text style={styles.emptyText}>
            {query ? `No branches match "${query}"` : 'No branches found.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.branchName}>{item.name}</Text>
          {item.address ? (
            <Text style={styles.address}>{item.address}</Text>
          ) : null}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
  row: { paddingVertical: 16, paddingHorizontal: 4 },
  branchName: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 2 },
  address: { fontSize: 13, color: '#6b7280' },
  empty: { paddingTop: 32, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9ca3af' },
});
