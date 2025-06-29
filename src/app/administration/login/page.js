"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/authSlice";
import {setUserRole, setLoading} from "@/Redux/menuSlice";


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.menu?.loading ?? false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    dispatch(setLoading(true));
    
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      document.cookie = `rsvAuthToken=${data.token}; path=/;`;
      // document.cookie = `rsvDesignation=${data.role}`;
      // Dispatch Redux action to store token
      dispatch(login({ token: data.token, role: data.role, user: data.user }));
      dispatch(setUserRole(data.role));

      setMessage("Logged in successfully");
      router.push("/administration/dashboard");
      dispatch(setLoading(false)); 
    } else {
      dispatch(setLoading(false)); 
      setMessage(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#0A8270] mb-2">
          Sign In
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          to continue with Medicheck
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded px-3 bg-white">
              <span className="text-gray-500 mr-2">📧</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 outline-none text-gray-700"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="flex items-center border rounded px-3 bg-white">
              <span className="text-gray-500 mr-2">🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 outline-none text-gray-700"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>
          {message && (
            <p className={`text-sm text-red-500`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className={`w-full p-2 mt-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-[#0A8270] hover:bg-[#086d5f]'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
