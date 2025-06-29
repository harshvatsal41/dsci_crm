'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { login } from "@/Redux/Reducer/authSlice";

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false); // Track loading state
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true); // Start loading

        const res = await fetch("/api/admin/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {

            document.cookie = `rsvAuthToken=${data.token}; path=/;`;
            // document.cookie = `rsvDesignation=${data.role}`;
            // Dispatch Redux action to store token
            dispatch(login({token : data.token, role: data.role}));

            // alert("Logged in successfully");
            setMessage("Logged in successfully");
            router.push("/administration/dashboard");
            setLoading(false); // Stop loading

        } else {
            setLoading(false); // Stop loading
            setMessage(data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="w-96 p-4 border rounded-lg">
                <h1 className="text-xl font-bold mb-4">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full text-gray-700 p-2 mb-2 border rounded"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading} // Disable input when loading
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full text-gray-700 p-2 mb-2 border rounded"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading} // Disable input when loading
                />

                <button
                    type="submit"
                    className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {message && <p className="mt-2 text-red-500">{message}</p>}
            </form>
        </div>
    );
}