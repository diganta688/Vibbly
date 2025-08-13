import React, { useState } from "react";
import { Lock, CircleUser } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { login, isLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ username: "", password: "" });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleLogin = async () => {
    login(data);
  };

  return (
    <div className="main flex flex-col md:flex-row gap-1 bg-base-100/50 w-full h-screen text-white" style={{overflowY:"auto"}}>
      <div className="order-1 md:order-2 w-full md:w-1/2 bg-base-100/50 flex items-center justify-center rounded-lg">
        <div className="flex items-center justify-center p-12 w-full h-full">
          <div className="max-w-md text-center w-full">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl bg-primary/10 ${
                    i % 2 === 0 ? "animate-pulse" : ""
                  }`}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{color:"#605DFF"}}>Join our Community</h2>
          </div>
        </div>
      </div>
      <div className="order-2 md:order-1 w-full md:w-1/2 bg-base-100/50 p-10 flex flex-col gap-6 items-center justify-center rounded-lg shadow-md ">
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SendTimeExtensionIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-white p-4" style={{color:"#605DFF"}}>
            Hi, Welcome Back{" "}
          </h1>
          <h2 className="text-md  text-center text-white p-4">
            Login to Your Account
          </h2>
        </div>

        <div className="flex flex-col w-full gap-4">
          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <CircleUser className="mr-3" sx={{ color: "white", my: 0.5 }} />
            <TextField
              label="Enter your Username or Email address"
              variant="standard"
              className="w-full"
              autoFocus
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              InputLabelProps={{
                sx: { color: "white" }, // Label color
              }}
              InputProps={{
                sx: {
                  color: "white", // Input text color
                  "&:before": { borderBottomColor: "white" }, // Default underline
                  "&:after": { borderBottomColor: "white" }, // Focus underline
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <Lock className="mr-3" sx={{ color: "white", my: 0.5 }} />
            <TextField
              label="Password"
              variant="standard"
              className="w-full"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              InputLabelProps={{
                sx: { color: "white" },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  "&:before": { borderBottomColor: "white" },
                  "&:after": { borderBottomColor: "white" },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <p className="text-sm  p-1">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline flex justify-end p-2 text-white"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <Button
            disabled={isLogin || data.username === "" || data.password === ""}
            onClick={handleLogin}
            variant="outline"
            className="w-full border border-white text-white hover:bg-white hover:text-black"
            style={{ fontWeight: "700" }}
          >
            {isLogin  ? "Loading..." : "Log In"}
          </Button>
          <p className="text-sm text-white p-1">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline text-white">
              SignUp here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
