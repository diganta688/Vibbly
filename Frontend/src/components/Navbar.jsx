import React from "react";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import { Settings, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function Navbar() {
  const { authUser, logout, isLogout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-gray-900 p-4 relative top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center ">
        <div className="">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SendTimeExtensionIcon className="w-8 h-8 text-primary" />
          </div>
            <span className="text-white text-lg font-semibold ">Vibbly</span>
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="nav-icons-main flex items-center cursor-pointer bg-gray-850">
            <h1 className="text-white text-2xl">
              <Settings />
            </h1>
            <span
              className="nav-rightside-icon text-white font-semibold p-1"
              style={{ fontSize: "11px" }}
            >
              Settings
            </span>
          </div>
          {authUser && (
            <>
              <Link to={`/profile`}>
                <div className="nav-icons-main flex items-center cursor-pointer">
                  <h1 className="text-white text-2xl">
                    <User />
                  </h1>
                  <span
                    className="nav-rightside-icon text-white font-semibold p-1"
                    style={{ fontSize: "11px" }}
                  >
                    Profile
                  </span>
                </div>
              </Link>
              <button
                className="nav-icons-main flex items-center cursor-pointer"
                onClick={handleLogout}
                disabled={isLogout}
                style={{ opacity: isLogout ? 0.5 : 1 }}
              >
                <h1
                  className="text-white text-2xl"
                  style={{ opacity: isLogout ? 0.5 : 1 }}
                >
                  <LogOut />
                </h1>
                <span
                  className="nav-rightside-icon text-white font-semibold p-1"
                  style={{ fontSize: "11px", opacity: isLogout ? 0.5 : 1 }}
                >
                  {isLogout ? "Logging out..." : "Logout"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
