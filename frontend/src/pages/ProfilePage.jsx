import React from "react";
import { useAuth } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;
  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow rounded p-4">
      <h2 className="text-xl mb-4 font-bold">My Profile</h2>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Aadhar Number:</strong> {user.aadharNumber}</div>
      <div><strong>Role:</strong> {user.role}</div>
      <div><strong>Address:</strong> {user.address}</div>
      <div><strong>Age:</strong> {user.age}</div>
      <div className="mt-6">
        <ChangePassword />
      </div>
    </div>
  )
}
