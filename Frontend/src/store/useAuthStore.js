import { create } from "zustand";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignup: false,
  isLogin: false,
  isLogout: false,
  isupdateprofile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,
  checkauth: async () => {
    try {
      const response = await api.get("/auth/check");
      set({ authUser: response.data });
      // console.log("User authenticated:", response.data);
      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  setAuthUser: (user) => set({ authUser: user }),

  signup: async (data) => {
    set({ isSignup: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSignup: false });
    }
  },

  login: async (data) => {
    set({ isLogin: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();      
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    set({ isLogout: true });
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogout: false });
    }
  },
  connectSocket:()=>{
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
  auth: {
    userId: authUser.user._id,
  },
});

    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {      
      set({ onlineUsers: userIds });
    });
  },

  disConnectSocket:()=>{
    if (get().socket?.connected) get().socket.disconnect();

  }
}));
