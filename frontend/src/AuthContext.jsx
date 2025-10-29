// src/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     
  const [role, setRole] = useState(null);     

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      fetchProfile(storedRole);
    }
  }, []);

  const login = async (aadharNumber, password) => {
    const { data } = await api.post("/user/login", { aadharNumber, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "user");
    await fetchProfile("user");
    return data;
  };

  const signup = async (userData) => {
    console.log(userData)
    const { data } = await api.post("/user/signup", userData);
    console.log("Auth",data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "user");
    await fetchProfile("user");
    return data;
  };



  const candidateSignup = async (candidateData) => {
    const { data } = await api.post("/candidate/signupasCandidate", candidateData);
    console.log("SIGNUP RESPONSE:", data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "candidate");
    const candidateId = data.response._id;
      if (!candidateId) {
    console.error("Candidate ID missing in signup response");
    return;
       }

    localStorage.setItem("id", candidateId);
    console.log("Stored candidate ID:", candidateId);
    await fetchProfile("candidate");
    return data;
  };
const fetchProfile = async (who = null) => {
    const role = who || localStorage.getItem("role");
    if (role === "candidate") {
      const candidateID = localStorage.getItem("id");
      if (!candidateID) {
        console.error("No candidate ID found in localStorage");
        return;
      }
      try {
        const { data } = await api.get(`/candidate/${candidateID}`);
        setUser(data.candidate);
        setRole("candidate");
      } catch (err) {
        console.error("Error fetching candidate profile", err);
      }
    } else {
      try {
        const { data } = await api.get("/user/profile");
        setUser(data.user);
        setRole("user");
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    }
  };

 
  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    if (role && (role !== "candidate" || (role === "candidate" && id))) {
      fetchProfile(role);
    }
  }, []);

 


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user, role, login, signup,
       candidateSignup,
      logout, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
