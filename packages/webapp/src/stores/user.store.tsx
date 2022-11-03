import zustand from "zustand";

interface userState {
  user: any;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const userStore = zustand<userState>()((set) => ({
  user: {},
  isLoggedIn: false,
  role: "User",
  setIsLoggedIn: (status) => set((state) => ({ isLoggedIn: status || false })),
  setUser: (user) =>
    set((state) => ({ user: user, role: user.role || "User" })),
  logout: () => set(() => ({ user: {}, isLoggedIn: false, token: "" })),
}));
