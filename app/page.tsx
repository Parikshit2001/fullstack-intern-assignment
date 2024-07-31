"use client";

import { useEffect, useState } from "react";
import { setToken } from "@/redux/auth/auth.slice";
import useAuthSession from "../hooks/useAuthSession";
import { useAppDispatch } from "@/redux/store";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const { user, signin, signout, token } = useAuthSession();
  const [authData, setAuthData] = useState<string>("");

  const handleLogin = async () => {
    // Implement the logic to authenticate the user
    setError("");
    try {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      signin(data.username, data.token);
    } catch (error: any) {
      if (error && error.message) {
        setError(error.message);
      } else {
        setError("Unknown error occured");
      }
    }
  };

  const handleSignup = async () => {
    setError("");
    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      signin(data.username, data.token);
    } catch (error: any) {
      if (error && error.message) {
        setError(error.message);
      } else {
        setError("Unknown error occured");
      }
    }
  };

  const handleAuthClick = async () => {
    setAuthData("");
    try {
      const response = await fetch("/api/authroute", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error);
      }
      setAuthData(data.message);
    } catch (error: any) {
      setAuthData(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl font-bold text-black">
              Welcome, {user.username}
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username(parik)"
              className="w-full px-4 py-2 mt-4 border rounded-md text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password(12345678)"
              className="w-full px-4 py-2 mt-4 border rounded-md text-black"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Signup
            </button>
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </div>
        )}
        <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
          <h3 className="text-lg font-semibold">
            The hook should be usable like this:{" "}
          </h3>
          <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
            <code>
              {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
            </code>
          </pre>
        </div>
        <div>
          {user && (
            <button
              onClick={signout}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
        <div>
          <button
            onClick={handleAuthClick}
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
          >
            Check Auth Endpoint
          </button>
          {authData && (
            <div className="text-black text-center mt-4"> {authData} </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
