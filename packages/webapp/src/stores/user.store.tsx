import zustand from "zustand";

interface userState {
  isLoading: string;
  token: string;
  user: any;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (status: boolean) => void;
}

export const userStore = zustand<userState>()((set) => ({
  isLoading: "idle",
  token: "",
  user: {},
  isLoggedIn: false,
  role: "User",
  setToken: (token) => set(() => ({ token })),
  setIsLoggedIn: (status) => set((state) => ({ isLoggedIn: status || false })),
  setUser: (user) =>
    set((state) => ({ user: user, role: user.role || "User" })),
  logout: () => set(() => ({ user: {}, isLoggedIn: false, token: "" })),
  setLoading: (status) =>
    set(() => ({ isLoading: status ? "fetching" : "fetched" })),
}));
