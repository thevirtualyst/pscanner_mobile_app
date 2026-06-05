import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, ScanResult } from '../types';

const API_URL = 'https://www.vmart.thevirtualyst.com';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export default function ScannerScreen({ route, navigation }: Props) {
  const { branchId, branchName, storeName } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cooldown = useRef(false);

  const handleBarcode = useCallback(
    async ({ data: barcode }: { data: string }) => {
      if (cooldown.current || fetching) return;
      cooldown.current = true;
      setError(null);
      setFetching(true);

      try {
        const res = await fetch(
          `${API_URL}/api/public/scan?branchId=${encodeURIComponent(branchId)}&barcode=${encodeURIComponent(barcode)}`,
        );
        const json = await res.json();

        if (json.success) {
          navigation.navigate('ProductDetail', { result: json as ScanResult });
        } else {
          setError('Product not found in this branch.');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setFetching(false);
        // allow next scan after 2 s
        setTimeout(() => { cooldown.current = false; }, 2000);
      }
    },
    [branchId, fetching, navigation],
  );

  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access is required to scan barcodes.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={fetching ? undefined : handleBarcode}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
      />

      {/* Dimmed overlay with viewfinder cutout */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.storeLabel}>{storeName} · {branchName}</Text>
          {fetching && <ActivityIndicator color="#fff" style={{ marginTop: 12 }} />}
          {error && !fetching && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          {!fetching && !error && (
            <Text style={styles.hint}>Point camera at a barcode</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const VIEWFINDER = 260;
const CORNER = 24;
const BORDER = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  permText: { fontSize: 15, color: '#374151', textAlign: 'center', marginBottom: 20 },
  btn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  overlay: { ...StyleSheet.absoluteFillObject },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayMiddle: { flexDirection: 'row', height: VIEWFINDER },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: 24,
  },

  viewfinder: {
    width: VIEWFINDER,
    height: VIEWFINDER,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#16a34a',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  cornerTR: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },

  storeLabel: { color: '#d1fae5', fontSize: 13, fontWeight: '600' },
  hint: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 12 },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
