import React, { useState } from "react";
import { Lock, AtSign, CircleUser } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const { signup, isSignup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPasswordMismatch =
    confirmPassword && formData.password !== confirmPassword;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return strongPasswordRegex.test(password);
  };
  const isPasswordInvalid =
    formData.password && !isStrongPassword(formData.password);
  const isFormInvalid =
    !formData.fullname ||
    !formData.email ||
    !formData.username ||
    !formData.password ||
    !confirmPassword ||
    isPasswordMismatch ||
    isPasswordInvalid;

  const handlesignup = async () => {
    signup(formData);
  };

  return (
    <div className="main flex flex-col md:flex-row gap-1 bg-base-100/50 w-full h-screen text-white">
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
      <div className="order-2 md:order-1 w-full md:w-1/2 bg-base-100/50 p-10 flex flex-col gap-6 items-center justify-center rounded-lg shadow-md">
        <div className="w-full flex flex-col gap-4 items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SendTimeExtensionIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-white p-4" style={{color: "#605DFF"}}>
            Hey, Welcome to Vibbly
          </h1>
          <h2 className="text-md text-center text-white p-4" >
            Register Yourself
          </h2>
        </div>
        <div className="flex flex-col w-full gap-4">
          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <CircleUser sx={{ color: "white", my: 0.5 }} className="mr-3" />
            <TextField
              label="Full Name"
              variant="standard"
              className="w-full"
              autoFocus
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
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
            <AtSign sx={{ color: "white", my: 0.5 }} className="mr-3" />
            <TextField
              label="Email"
              variant="standard"
              className="w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
InputLabelProps={{ sx: { color: "white" } }}
              InputProps={{
                sx: {
                  color: "white",
                  "&:before": { borderBottomColor: "white" },
                  "&:after": { borderBottomColor: "white" },
                },
              }}            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <CircleUser sx={{ color: "white", my: 0.5 }} className="mr-3" />
            <TextField
              label="Username"
              variant="standard"
              className="w-full"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
InputLabelProps={{ sx: { color: "white" } }}
              InputProps={{
                sx: {
                  color: "white",
                  "&:before": { borderBottomColor: "white" },
                  "&:after": { borderBottomColor: "white" },
                },
              }}            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <Lock sx={{ color: "white", my: 0.5 }} className="mr-3" />
            <TextField
              label={
                isPasswordInvalid
                  ? "Must be at least 6 chars, 1 number & 1 special character"
                  : "Password"
              }
              error={isPasswordInvalid}
              variant="standard"
              className="w-full"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              InputLabelProps={{ sx: { color: "white" } }}
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

          <Box sx={{ display: "flex", alignItems: "flex-end", color: "white" }}>
            <Lock sx={{ color: "white", my: 0.5 }} className="mr-3" />
            <TextField
              label={
                isPasswordMismatch ? "Password mismatched" : "Confirm Password"
              }
              error={isPasswordMismatch}
              variant="standard"
              className="w-full"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ sx: { color: "white" } }}
              InputProps={{
                sx: {
                  color: "white",
                  "&:before": { borderBottomColor: "white" },
                  "&:after": { borderBottomColor: "white" },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      sx={{ color: "white" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <p className="text-sm text-gray-600 p-1 pt-0 ">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline flex text-white justify-end p-2"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <Button
            variant="outline"
            className="w-full border border-white text-white hover:bg-white hover:text-black"
            style={{ fontWeight: "700" }}
            disabled={isFormInvalid || isSignup}
            onClick={handlesignup}
          >
            {isSignup ? "Loading..." : "Sign Up"}
          </Button>
          <p className="text-sm text-white p-1 ">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline text-white">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
