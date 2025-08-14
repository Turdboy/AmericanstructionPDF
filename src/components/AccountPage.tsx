import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, updateEmail } from "firebase/auth";

const AccountPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
      } else {
        navigate("/create-account");
      }
    });

    return () => unsubscribe();
  }, [navigate]); // ✅ Only one useEffect here

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const handleResetPassword = async () => {
    if (userData?.email) {
      try {
        await sendPasswordResetEmail(auth, userData.email);
        alert("Password reset email sent!");
      } catch (error) {
        console.error("Error sending reset email:", error);
        alert("Failed to send reset email.");
      }
    }
  };

  const handleEmailUpdate = async () => {
    if (userData && newEmail) {
      try {
        await updateEmail(userData, newEmail);
        alert("Email updated successfully. Please re-login.");
      } catch (error) {
        console.error("Error updating email:", error);
        alert("Failed to update email. You may need to log in again.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Your Account</h2>
      {userData && (
        <div className="space-y-4">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>UID:</strong> {userData.uid}</p>
          <p><strong>Created:</strong> {formatDate(userData.metadata.creationTime)}</p>
          <p><strong>Last Sign-In:</strong> {formatDate(userData.metadata.lastSignInTime)}</p>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>

          <button
            onClick={handleResetPassword}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2"
          >
            Reset Password
          </button>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border px-3 py-1 rounded w-full"
            />
            <button
              onClick={handleEmailUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
            >
              Change Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
