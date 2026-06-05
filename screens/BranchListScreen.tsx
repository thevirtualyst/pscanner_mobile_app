import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Branch, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BranchList'>;

export default function BranchListScreen({ route, navigation }: Props) {
  const { store } = route.params;

  function handleSelect(branch: Branch) {
    navigation.navigate('Scanner', {
      branchId: branch.id,
      branchName: branch.name,
      storeName: store.name,
    });
  }

  return (
    <FlatList
      data={store.branches}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No branches found for this store.</Text>
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
  branchName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  address: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
  empty: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
  },
});
