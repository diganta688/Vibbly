import React, { useRef, useState } from "react";
import { chatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const { sendMessage } = chatStore();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileImageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // preview without base64
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileImageRef.current) fileImageRef.current.value = "";
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (imageFile) formData.append("image", imageFile);

    setIsSending(true);
    try {
      await sendMessage(formData); // send as multipart/form-data
      setText("");
      removeImage();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full bg-base-200 relative bottom-2" >
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleChatSend} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <textarea
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            style={{ fontFamily: "sans-serif", fontSize: "1.1rem" }}
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileImageRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileImageRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={isSending || (!text.trim() && !imageFile)}
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
