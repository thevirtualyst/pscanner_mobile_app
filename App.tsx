import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import StoreListScreen from './screens/StoreListScreen';
import BranchListScreen from './screens/BranchListScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
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
  );
}
