import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", 
    age: "", 
    aadharNumber: "", 
    password: "", 
    address: "", 
    role: "voter"  
  });
  const [err, setErr] = useState("");

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(form);
      navigate("/");
    } catch (e) {
      console.log(e)
      setErr(e.response?.data?.error || "Signup failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 shadow-lg rounded">
        <div className="mb-2 text-xl font-bold">Signup</div>
        {err && <div className="text-red-500">{err}</div>}
        
        <input name="name" placeholder="Name" className="block border my-2 p-2 rounded w-full" onChange={change} />
        <input name="age" placeholder="Age" className="block border my-2 p-2 rounded w-full" onChange={change} />
        <input name="address" placeholder="Address" className="block border my-2 p-2 rounded w-full" onChange={change} />
        <input name="aadharNumber" placeholder="Aadhar (XXXX XXXX XXXX)" className="block border my-2 p-2 rounded w-full" onChange={change} />
        <input name="password" type="password" placeholder="Password" className="block border my-2 p-2 rounded w-full" onChange={change} />

      
        <select 
          name="role" 
          className="block border my-2 p-2 rounded w-64"
          value={form.role}
          onChange={change}
        >
          <option value="voter">Voter</option>
        </select>

        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">Signup</button>
        <div className="mt-3 text-center">Already registered? <a href="/login" className="text-blue-500">Login</a></div>
        <div className="mt-3 text-center"> registered as candidate? <a href="/candidate-signup" className="text-blue-500">Signup as candiadte</a></div>
      </form>
    </div>
  );
}
