import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created.");
      navigate("/inspection");
    } catch (error: any) {
        console.error("🔥 Firebase Error:", error);
        if (error.code === "auth/email-already-in-use") {
          alert("❌ Email is already in use. Try logging in.");
        } else if (error.code === "auth/invalid-email") {
          alert("❌ Invalid email address format.");
        } else if (error.code === "auth/weak-password") {
          alert("❌ Password should be at least 6 characters.");
        } else {
          alert("❌ Something went wrong: " + error.message);
        }
      }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleCreate} className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#002147]">Create Account</h2>
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
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Create Account
        </button>
        <button type="button" onClick={() => navigate("/")} className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400">
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default CreateAccountPage;
