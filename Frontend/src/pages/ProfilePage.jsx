import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Camera, AtSign } from "lucide-react";
import { Box, TextField } from "@mui/material";
import { CircleUser } from "lucide-react";
import { Button } from "../components/ui/button";
import {api} from "../lib/axios"; 
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    profilePicture: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (authUser?.user) {
      setFormData({
        fullname: authUser.user.fullname,
        username: authUser.user.username,
        email: authUser.user.email,
        profilePicture: authUser.user.profilePicture || "",
      });
      setPreviewUrl(authUser.user.profilePicture || "");
    }
  }, [authUser]);
  useEffect(() => {
    if (!authUser?.user) return;
    const original = {
      fullname: authUser.user.fullname,
      username: authUser.user.username,
      email: authUser.user.email,
      profilePicture: authUser.user.profilePicture || "",
    };
    const hasFormChanges = JSON.stringify({
      fullname: formData.fullname,
      username: formData.username,
      email: formData.email,
    }) !== JSON.stringify({
      fullname: original.fullname,
      username: original.username,
      email: original.email,
    });
    
    setHasChanges(hasFormChanges || selectedFile !== null);
  }, [formData, authUser, selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

const handleSave = async () => {
  try {
    setIsSaving(true);
    const formDataToSend = new FormData();
    const original = authUser.user;
    if (formData.username !== original.username) {
      formDataToSend.append("username", formData.username);
    }
    if (formData.email !== original.email) {
      formDataToSend.append("email", formData.email);
    }
    if (formData.fullname !== original.fullname) {
      formDataToSend.append("fullname", formData.fullname);
    }
    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }
    if ([...formDataToSend.keys()].length === 0) {
      toast("No changes to save");
      setIsSaving(false);
      return;
    }
    const response = await api.put("/auth/update-profile", formDataToSend, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profile updated successfully");
    setAuthUser({
      ...authUser,
      user: {
        ...authUser.user,
        ...formData,
        profilePicture: response.data.user?.profilePicture || formData.profilePicture,
      },
    });
    setSelectedFile(null);
    if (response.data.user?.profilePicture) {
      setPreviewUrl(response.data.user.profilePicture);
      setFormData((prev) => ({
        ...prev,
        profilePicture: response.data.user.profilePicture,
      }));
    }
    setHasChanges(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    setIsSaving(false);
  }
};


  if (!authUser) {
    return <p className="text-lg">No user information available</p>;
  }

  return (
    <div className="flex flex-col gap-4 items-center p-5">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="relative p-1 border border-3 border-white rounded-full">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full border-black object-cover"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-400 flex items-center justify-center">
            <User className="w-20 h-20 text-black" />
          </div>
        )}
        <button
          type="button"
          className="absolute bottom-0 right-0 w-9 h-9 text-black bg-gray-400 rounded-full p-1 border border-black cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <Camera />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-sm text-gray-400 font-sans text-center mt-1">
        Click the camera icon to change the profile picture
      </p>

      <h2 className="text-3xl font-semibold text-yellow-500 text-center">
        Hello, {authUser.user.fullname}
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
          <CircleUser className="mr-3" />
          <TextField
            required
            label="Full Name"
            variant="standard"
            className="w-full"
            value={formData.fullname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullname: e.target.value }))
            }
            InputLabelProps={{ sx: { color: "white" } }}
            InputProps={{
              sx: {
                color: "white",
                "&:before": { borderBottomColor: "white" },
                "&:after": { borderBottomColor: "white" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
          <CircleUser className="mr-3" />
          <TextField
            required
            label="Username"
            variant="standard"
            className="w-full"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            InputLabelProps={{ sx: { color: "white" } }}
            InputProps={{
              sx: {
                color: "white",
                "&:before": { borderBottomColor: "white" },
                "&:after": { borderBottomColor: "white" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
          <AtSign className="mr-3" />
          <TextField
            required
            label="Email Address"
            variant="standard"
            className="w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            InputLabelProps={{ sx: { color: "white" } }}
            InputProps={{
              sx: {
                color: "white",
                "&:before": { borderBottomColor: "white" },
                "&:after": { borderBottomColor: "white" },
              },
            }}
          />
        </Box>
        
        <Button
          variant="secondary"
          className="w-full bg-black"
          style={{ fontWeight: "700" }}
          disabled={!hasChanges || isSaving}
          onClick={handleSave}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-md mt-4">
        <h1>Account Information</h1>
        <div className="flex flex-col gap-4 p-2">
          <div className="flex justify-between border-b border-gray-500 pb-2">
            <span>Member Since:</span>
            <span>
              {new Date(authUser.user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-500 pb-2">
            <span>Account Status:</span>
            <span
              className={
                authUser.user.isActive ? "text-green-500" : "text-red-500"
              }
            >
              {authUser.user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;