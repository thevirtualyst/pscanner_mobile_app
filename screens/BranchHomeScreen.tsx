import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { clearLastBranch } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'BranchHome'>;

export default function BranchHomeScreen({ route, navigation }: Props) {
  const { branchId, branchName, storeName, branchAddress } = route.params;

  function handleScan() {
    navigation.navigate('Scanner', { branchId, branchName, storeName });
  }

  async function handleChangeStore() {
    await clearLastBranch();
    navigation.reset({ index: 0, routes: [{ name: 'StoreList' }] });
  }

  return (
    <View style={styles.container}>
      {/* Store / branch info */}
      <View style={styles.infoCard}>
        <Text style={styles.storeLabel}>Store</Text>
        <Text style={styles.storeName}>{storeName}</Text>

        <View style={styles.divider} />

        <Text style={styles.branchLabel}>Branch</Text>
        <Text style={styles.branchName}>{branchName}</Text>
        {branchAddress ? (
          <Text style={styles.address}>{branchAddress}</Text>
        ) : null}
      </View>

      {/* Scan button */}
      <TouchableOpacity style={styles.scanBtn} onPress={handleScan} activeOpacity={0.85}>
        <Text style={styles.scanIcon}>⬤</Text>
        <Text style={styles.scanBtnText}>Start Scanning</Text>
      </TouchableOpacity>

      {/* Change options */}
      <View style={styles.changeRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeBtn}>
          <Text style={styles.changeBtnText}>Change Branch</Text>
        </TouchableOpacity>
        <View style={styles.changeDot} />
        <TouchableOpacity onPress={handleChangeStore} style={styles.changeBtn}>
          <Text style={styles.changeBtnText}>Change Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
    justifyContent: 'center',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  storeLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.8, marginBottom: 4 },
  storeName: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 },
  branchLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.8, marginBottom: 4 },
  branchName: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  address: { fontSize: 13, color: '#6b7280', lineHeight: 18 },

  scanBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanIcon: { fontSize: 16, color: '#fff', opacity: 0.9 },
  scanBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },

  changeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  changeBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  changeBtnText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  changeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#d1d5db' },
});
