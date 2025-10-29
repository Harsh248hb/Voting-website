import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import io from "socket.io-client";

const socket = io('http://localhost:3000');

export default function CandidateSignupPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    party: ""
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { candidateSignup } = useAuth(); 

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await candidateSignup(form);  
      socket.emit("candidate_registered");
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 shadow-lg rounded">
        <div className="mb-2 text-xl font-bold">Candidate Signup</div>
        {err && <div className="text-red-500">{err}</div>}
        <input name="name" placeholder="Name" className="block border my-2 p-2 rounded w-full" onChange={change} value={form.name} />
        <input name="age" placeholder="Age" type="number" className="block border my-2 p-2 rounded w-full" onChange={change} value={form.age} />
        <input name="party" placeholder="Party" className="block border my-2 p-2 rounded w-full" onChange={change} value={form.party} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">Signup as Candidate</button>
        <div className="mt-3 text-center">
          Already have an account? <Link to="/candidate-login" className="text-blue-500">Login as candidate</Link>
        </div>
      </form>
    </div>
  );
}
