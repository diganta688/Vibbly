import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { chatStore } from "../store/useChatStore";
import {User} from "lucide-react";
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
             {selectedUser?.profilePicture !== "" ? (
                <img
                  src={selectedUser?.profilePicture}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <User className="size-12 object-cover rounded-full border bg-white text-gray-500" />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} className="cursor-pointer">
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;