import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { chatStore } from "../store/useChatStore";
import { User, Video, Phone } from "lucide-react";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser?.profilePicture !== "" ? (
                <img
                  src={selectedUser?.profilePicture}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <User className="size-10 object-cover rounded-full border bg-white text-gray-500" />
              )}
            </div>
          </div>

          {/* User info */}
          <div className="flex flex-col">
            <h3 className="font-sm" style={{fontSize: "13px"}}>{selectedUser.username}</h3>
            <p className="text-base-content/70 ml-1" style={{fontSize: "10px", fontFamily: "sans-serif"}}>
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <div className="cursor-pointer rounded-lg hover:bg-base-300">
            <Video className="size-6" />
          </div>
          <div className="cursor-pointer rounded-lg hover:bg-base-300">
            <Phone className="size-5 relative" style={{top: "2px"}}/>
          </div>
          </div>
          <div onClick={() => setSelectedUser(null)} className="cursor-pointer">
            <X className="size-6" />
          </div>
        </div>
        {/* Close button */}
      </div>
    </div>
  );
};
export default ChatHeader;
