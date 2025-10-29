import React, { useState } from "react";
import { api } from "../api";

export default function ChangePassword() {
  const [fields, setFields] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const onChange = e => setFields({...fields, [e.target.name]: e.target.value});
  const submit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.put("/user/profile/password", fields);
      setMsg("Password changed.");
    } catch(e) {
      setMsg(e.response?.data?.error || "Error");
    }
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="font-semibold">Change Password</div>
      <input name="currentPassword" type="password" placeholder="Current Password" className="block border w-full p-2 rounded" value={fields.currentPassword} onChange={onChange} />
      <input name="newPassword" type="password" placeholder="New Password" className="block border w-full p-2 rounded" value={fields.newPassword} onChange={onChange} />
      <button className="bg-blue-500 text-white rounded px-4 py-2">Change Password</button>
      {msg && <div className="mt-1">{msg}</div>}
    </form>
  );
}
