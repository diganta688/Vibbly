import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Input } from "../components/ui/input";
import { api } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { User, Plus, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function SearchUser() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { onlineUsers, authUser } = useAuthStore();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.post("/auth/user-find", { query: search });
        // console.log(typeof(res.data));
        console.log(res);

        setUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    if (!search.trim()) {
      fetchUsers();
      return;
    }
    const timeoutId = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);
  const addUserToContacts = async (userId) => {
    try {
      const res = await api.get(`/auth/add-user-contact/${userId}`);

      if (res.status === 200) {
        toast.success(res.data.message);

        useAuthStore.setState((state) => ({
          authUser: {
            ...state.authUser,
            user: {
              ...state.authUser.user,
              contacts: [...new Set([...state.authUser.user.contacts, userId])],
            },
          },
        }));
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast((t) => <span>{error.response.data.message} 👍</span>, {
          icon: "ℹ️",
        });
      } else {
        toast.error(error.response?.data?.message || "Error adding contact");
      }
    }
  };

  const isContact = (userId) => {
    return authUser?.user?.contacts?.some(
      (c) => String(c._id || c) === String(userId)
    );
  };

  return (
    <Box
      sx={{
        width: 300,
        background: "rgb(25,30,36)",
        height: "100vh",
        color: "white",
        padding: "1rem",
      }}
      role="presentation"
    >
      <div className="flex items-center gap-6">
        <Input
          type="text"
          placeholder="Enter username to find"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} sx={{ color: "white" }} />
        </div>
      )}

      {!loading && users.length > 0 && (
        <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li key={user._id || user.id} style={{ padding: "0.5rem 0" }}>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt=""
                        className="rounded-full w-11 h-11"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gray-400 flex items-center justify-center">
                        <User className="w-8 h-8 text-black" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div>{user.username}</div>
                    <div
                      className=""
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "13px",
                        color: `${
                          onlineUsers.includes(user._id) ? "green" : "gray"
                        }`,
                      }}
                    >
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
                <button
                  className="border p-1 rounded-lg cursor-pointer"
                  onClick={() => addUserToContacts(user._id)}
                  disabled={isContact(user._id)}
                >
                  {isContact(user._id) ? <CheckCheck /> : <Plus />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && users.length === 0 && (
        <p style={{ marginTop: "1rem", color: "gray" }}>No results found</p>
      )}
    </Box>
  );
}
