import { create } from "zustand";
import toast from "react-hot-toast";
import { api } from "../lib/axios";
import {useAuthStore} from "./useAuthStore"

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get(`/message/${userId}`);
      set({ messages: res.data });
      console.log(get().messages);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(`/message/send/${selectedUser._id}`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  listenToMessages:()=>{
    const {selectedUser}=get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    
    socket.on("newMessage", (newMessage)=>{
        set({messages:[...get().messages, newMessage]})
    })
},

unListenToMessages: ()=>{
      const socket = useAuthStore.getState().socket;
    // const socket = 
    socket.off("newMessage")
  }
}));
