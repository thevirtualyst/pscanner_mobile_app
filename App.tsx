import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import StoreListScreen from './screens/StoreListScreen';
import BranchListScreen from './screens/BranchListScreen';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
