// src/pages/VotingPage.js
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import socket from '../socket';



export default function VotingPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedMsg, setVotedMsg] = useState('');

  

  useEffect(() => {
    fetchCandidates();
    fetchVoteCounts();

    socket.on("vote_updated", () => {
      fetchVoteCounts();
    });

    return () => socket.off("vote_updated");
  }, []);

  const fetchCandidates = async () => {
    const { data } = await api.get("/candidate");
    console.log("Fetched candidates:", data); 
    setCandidates(data);
  };

  const fetchVoteCounts = async () => {
    const { data } = await api.get("/candidate/vote/count");
    setVoteCounts(data);
  };

  const vote = async (candidate) => {
    setVotedMsg("");
    console.log("Voting for:", candidate);

      if (!candidate?._id) {
    setVotedMsg("Invalid candidate selected.");
    console.error("Invalid candidate object:", candidate);
    return;
  }

    try {
      await api.post(`/candidate/vote/${candidate._id}`);
      setVotedMsg(`You voted for ${candidate.name}`);
      socket.emit("vote_casted"); 
      await fetchVoteCounts();
      setHasVoted(true);
    } catch (e) {
      setVotedMsg(e.response?.data?.message || "Error voting.");
    }
  };

  // Map party to live vote count
  const partyVoteMap = {};
  voteCounts.forEach(c => { partyVoteMap[c.party] = c.count; });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl my-6 font-bold text-center">Candidate List</h2>
      {votedMsg && <div className="text-green-600 mb-2 text-center">{votedMsg}</div>}
      <div className="bg-white rounded shadow p-4 space-y-3">
        {Array.isArray(candidates) && candidates.map((c) => (
          <div key={c._id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-bold">{c.name}</span> — <span>{c.party}</span>
              {" "}
              <span className="text-sm text-gray-500">(Votes: {partyVoteMap[c.party] || 0})</span>
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 px-4 py-1 text-white rounded disabled:opacity-50"
              onClick={() => vote(c)}
              disabled={user?.isVoted}           
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
