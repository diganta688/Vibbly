import React, { useEffect, useRef } from "react";
import { chatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "lucide-react";

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessageLoading, selectedUser, listenToMessages, unListenToMessages } = chatStore();

  const bottomRef = useRef(null); // for scrolling to bottom

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      listenToMessages();
      return () => unListenToMessages();
    }
  }, [selectedUser?._id, getMessages, listenToMessages, unListenToMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const renderAvatar = (isSender) => {
    const profilePicture = isSender
      ? authUser.user.profilePicture
      : selectedUser.profilePicture;

    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
        <User className="w-4 h-4 text-black" />
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-base-100" >
      <ChatHeader />
      <div className="flex-1 p-4 space-y-4 h-full" style={{ overflowY: "auto" }}>
        {messages.map((message) => {
          const isSender = message.senderId === authUser.user._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  {renderAvatar(isSender)}
                </div>
              </div>
              <div className="chat-bubble max-w-xs p-2 rounded-lg flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="max-w-[180px] rounded-md mb-2"
                  />
                )}
                {message.text && (
                  <p className="whitespace-pre-wrap break-words" style={{ fontFamily: "sans-serif" }}>
                    {message.text}
                  </p>
                )}
                <span className="text-[10px] opacity-60 mt-1 self-end" style={{ fontFamily: "sans-serif" }}>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
