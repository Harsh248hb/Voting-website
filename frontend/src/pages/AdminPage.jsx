import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", party: "" });

  useEffect(() => { fetchCandidates() }, []);
  const fetchCandidates = async () => {
    const { data } = await api.get("/candidate");
    setCandidates(data);
  };
  const addCandidate = async (e) => {
    e.preventDefault();
    await api.post("/candidate", form);
    setForm({ name: "", age: "", party: "" });
    fetchCandidates();
  };
  const deleteCandidate = async (id) => {
    await api.delete(`/candidate/${id}`);
    fetchCandidates();
  };

  if (!user?.role !== "admin") return <div className="p-4">Not Allowed</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl mb-3">Admin Panel</h2>
      <form onSubmit={addCandidate} className="flex gap-2 mb-5">
        <input placeholder="Name" value={form.name} name="name" onChange={e => setForm({...form, name: e.target.value})} className="border rounded p-2" />
        <input placeholder="Party" value={form.party} name="party" onChange={e => setForm({...form, party: e.target.value})} className="border rounded p-2" />
        <input placeholder="Age" type="number" value={form.age} name="age" onChange={e => setForm({...form, age: e.target.value})} className="border rounded p-2" />
        <button className="bg-blue-500 text-white px-4 rounded">Add</button>
      </form>
      <div>
        {candidates.map((c) => (
          <div key={c._id} className="flex justify-between border-b py-2">
            <span>{c.name} — {c.party} — {c.age}</span>
            <button onClick={() => deleteCandidate(c._id)} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
