import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function CandidatePanel() {
  const { user, loading } = useAuth();
  const [myCandidate, setMyCandidate] = useState(null); 
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    if (user && user.role === "candidate") {
      fetchMyCandidate();
    }
  }, [user]);

  const fetchMyCandidate = async () => {
    try {
    
      const { data } = await api.get("/candidate");
      
      const match = data.find(
        c => c.name === user.name && c.party === user.party 
      );
      if (match) {
        setMyCandidate(match);
        fetchVoteForCandidate(match.name, match.party);
      }
    } catch (err) {
      console.error("Can't fetch candidate data", err);
    }
  };

  const fetchVoteForCandidate = async (name, party) => {
    try {
      // Get all candidate vote counts
      const { data } = await api.get("/candidate/vote/count");
      // Find the candidate's vote count by party
      const vc = data.find(v => v.party === party);
      setVoteCount(vc ? vc.count : 0);
    } catch {
      setVoteCount(0);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "candidate")
    return <div className="text-center mt-8 text-red-600">Access Denied: Candidate account required.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Candidate Panel</h2>
      <div className="mb-2">
        <span className="text-gray-600">Name: </span>
        <span className="font-semibold">{user.name}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600">Party: </span>
        <span className="font-semibold">{user.party || (myCandidate && myCandidate.party) || "N/A"}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600">Age: </span>
        <span className="font-semibold">{user.age}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600">Votes Received: </span>
        <span className="text-xl font-bold">{voteCount}</span>
      </div>
    </div>
  );
}
