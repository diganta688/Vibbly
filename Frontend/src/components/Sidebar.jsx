import { useState, useMemo } from "react";
import { chatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton";
import { User, Users, UserPlus, RefreshCw } from "lucide-react";
import SearchUser from "./SearchUser";
import Drawer from "@mui/material/Drawer";

const Sidebar = () => {
  const [searchUserOpen, setSearchUserOpen] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const {  selectedUser, setSelectedUser, isUserLoading } = chatStore();
  const { onlineUsers, authUser, checkauth } = useAuthStore();

  // ✅ Filter out yourself (so you don’t see your own profile in list)
  const contactUsers=authUser&&authUser?.user?.contacts;


  // ✅ Apply online filter if needed
  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? contactUsers.filter((u) => onlineUsers.includes(u._id))
      : contactUsers;
  }, [contactUsers, showOnlineOnly, onlineUsers]);

  const toggleDrawer = (newOpen) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setSearchUserOpen(newOpen);
  };

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6 hidden lg:block" />
            <span className="font-medium hidden lg:block">Contacts</span>
            {/* 🔄 Refresh Button */}
            <RefreshCw
              onClick={()=>checkauth()}
              className="cursor-pointer hover:text-blue-500"
            />
          </div>
          <div>
            <UserPlus
              onClick={() => setSearchUserOpen(true)}
              className="cursor-pointer"
            />
            <Drawer anchor="left" open={searchUserOpen} onClose={toggleDrawer(false)}>
              <SearchUser onClose={toggleDrawer(false)} />
            </Drawer>
          </div>
        </div>

        {/* Online Filter Toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <User className="size-12 object-cover rounded-full border bg-white text-gray-500" />
              )}
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Info */}
            <div className="hidden lg:block text-left min-w-0 flex flex-col gap-2 items-start">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-[12px] text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* Empty State */}
        {contactUsers?.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
