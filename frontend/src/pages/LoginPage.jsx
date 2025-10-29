import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(aadhar, password);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 shadow-lg rounded">
        <div className="mb-2 text-xl font-bold">Voter Login</div>
        {err && <div className="text-red-500">{err}</div>}
        <input placeholder="Aadhar Number" className="block border my-2 p-2 rounded w-64" value={aadhar} onChange={e => setAadhar(e.target.value)} />
        <input type="password" placeholder="Password" className="block border my-2 p-2 rounded w-64" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">Login</button>
        <div className="mt-3 text-center">Don't have an account? <a href="/signup" className="text-blue-500">Signup</a></div>
      </form>
    </div>
  );
}
