import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/inspection");
    } catch (error) {
      alert("❌ Login failed. Please check your email and password.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#002147]">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-[#002147] text-white py-2 rounded hover:bg-[#001830]">
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/create-account")}
          className="w-full bg-[#FF6B6B] text-white py-2 rounded hover:bg-[#FF4B4B]"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
