import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const ownId = req.user._id;
    const users = await User.find({ _id: { $ne: ownId } }).select("-password").populate("contacts");
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getmessages = async (req, res) => {
  try {
    const { id } = req.params;
    const myid = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myid, receiverId: id },
        { senderId: id, receiverId: myid },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, image } = req.body;
    const myid = req.user._id;
    console.log(req.file);
    let imgUrl;
    if (!text && !req?.file) {
      return res.status(400).json({
        message: "Please send either a text message OR an image, not both",
      });
    }
    const newMessage = new Message({
      senderId: myid,
      receiverId: id,
      text: text || null,
      image: req?.file?.path || null,
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(id);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};