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
                setMessage({ text: data.message, type: 'success' });
            } else {
                setMessage({ text: data.error || "Something went wrong.", type: 'error' });
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            setMessage({ text: "Failed to register. Please try again later.", type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-primary-600 p-6">
                        <h1 className="text-2xl font-bold text-white">Create an Account</h1>
                        <p className="text-primary-100">Join us today!</p>
                    </div>
                    
                    <form onSubmit={handleRegister} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                id="contactNo"
                                type="text"
                                placeholder="Enter your phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={formData.contactNo}
                                onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Register
                        </button>
                        
                        {message && (
                            <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                    
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Already have an account?{' '}
                            <a href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}