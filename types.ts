export type Branch = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type Store = {
  name: string;
  slug: string;
  logo_url: string | null;
  branches: Branch[];
};

export type RootStackParamList = {
  StoreList: undefined;
  BranchList: { store: Store };
};
