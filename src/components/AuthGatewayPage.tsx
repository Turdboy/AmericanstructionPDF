import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth"; // ✅ added signOut
import { useEffect, useState } from "react";

const AuthGatewayPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // optional but quick feedback
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-6">
      <div className="text-center text-gray-600 mb-4">
        {user ? `✅ Logged in as ${user.email}` : "❌ Not logged in"}
      </div>

      <h1 className="text-3xl font-bold text-center text-[#002147]">Welcome</h1>
      <p className="text-center text-gray-600">
        Login or create a new account to get started
      </p>

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-[#002147] text-white py-3 rounded hover:bg-[#001830]"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/create-account")}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Create Account
        </button>
      </div>

      {/* Logout button appears only if user is logged in */}
      {user && (
        <button
          onClick={handleLogout}
          className="mt-6 w-full max-w-sm bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export default AuthGatewayPage;
