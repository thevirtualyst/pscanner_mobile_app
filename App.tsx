import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import StoreListScreen from './screens/StoreListScreen';
import BranchListScreen from './screens/BranchListScreen';
import BranchHomeScreen from './screens/BranchHomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import { loadLastBranch, type SavedBranch } from './lib/storage';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ready, setReady] = useState(false);
  const [savedBranch, setSavedBranch] = useState<SavedBranch | null>(null);

  useEffect(() => {
    loadLastBranch()
      .then(setSavedBranch)
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName={savedBranch ? 'BranchHome' : 'StoreList'}
          screenOptions={{
            headerTintColor: '#16a34a',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen
            name="StoreList"
            component={StoreListScreen}
            options={{ title: 'Select Store' }}
          />
          <Stack.Screen
            name="BranchList"
            component={BranchListScreen}
            options={({ route }) => ({ title: route.params.store.name })}
          />
          <Stack.Screen
            name="BranchHome"
            component={BranchHomeScreen}
            options={{ title: '' }}
            initialParams={savedBranch ? { ...savedBranch, branchAddress: null } : undefined}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: 'Product Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
