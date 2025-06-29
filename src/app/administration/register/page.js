'use client';
import { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', contactNo: '' });
    const [message, setMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const res = await fetch('/api/admin/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Registered successfully");
                setMessage(data.message);
            } else {
                setMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            setMessage("Failed to register. Please try again later.");
        }
    };


    return (
        <div>
            <div className="min-h-screen flex items-center justify-center">
                <form onSubmit={handleRegister} className="w-96 p-4 border rounded-lg">
                    <h1 className="text-xl font-bold mb-4">Register</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full text-gray-700 p-2 mb-2 border rounded"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full text-gray-700 p-2 mb-2 border rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full text-gray-700 p-2 mb-2 border rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Contact No"
                        className="w-full text-gray-700 p-2 mb-2 border rounded"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                    />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Register</button>
                    {message && <p className="mt-2 text-red-500">{message}</p>}
                </form>
            </div>
        </div>
    );
}