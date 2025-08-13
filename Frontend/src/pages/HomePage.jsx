import React from "react";
import { chatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoSelectedUser from "../components/NoSelectedUser";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = chatStore();

  return (
    <div className="h-[90vh] bg-base-200">
      <div className="flex items-center justify-center h-full">
        <div className="bg-base-200 rounded-lg shadow-lg w-full h-full">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoSelectedUser />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
