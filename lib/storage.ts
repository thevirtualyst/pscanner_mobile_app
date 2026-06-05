import * as SecureStore from 'expo-secure-store';

const KEY = 'last_branch';

export type SavedBranch = {
  branchId: string;
  branchName: string;
  storeName: string;
};

export async function saveLastBranch(branch: SavedBranch): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(branch));
}

export async function loadLastBranch(): Promise<SavedBranch | null> {
  const json = await SecureStore.getItemAsync(KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as SavedBranch;
  } catch {
    return null;
  }
}

export async function clearLastBranch(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
