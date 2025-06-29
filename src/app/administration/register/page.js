'use client';
import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { Input, Button } from '@/Component/UI/ReusableCom';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { RegisterApi } from '@/utilities/ApiManager';

const initialState = {
    username: '', 
    email: '', 
    password: '', 
    contactNo: '' 
};

export default function Register() {
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const res = await RegisterApi('POST', formData);
            if (res.ok) {
                toast.success('Registration successful!');
                setTimeout(() => {
                    window.location.href = '/administration/login';
                }, 2000);
            } else {
                toast.error('Registration failed!');
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Failed to register. Please check your connection and try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center">
                        <h1 className="text-xl font-bold text-white">Create Account</h1>
                        <p className="text-blue-100 text-sm mt-1">Get started in just a minute</p>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleRegister} className="p-6 space-y-4">
                        {/* Username */}
                        <Input
                            label="Username"
                            type="text"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                            icon={FiUser}
                        />
                        
                        {/* Email */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            icon={FiMail}
                        />
                        
                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    {showPassword ? (
                                        <span className="flex items-center">
                                            <FiEyeOff className="mr-1" /> Hide
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <FiEye className="mr-1" /> Show
                                        </span>
                                    )}
                                </button>
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                                minLength="8"
                                icon={FiLock}
                            />
                        </div>
                        
                        {/* Contact Number */}
                        <Input
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.contactNo}
                            onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                            icon={FiPhone}
                        />
                        
                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-500">
                                        Terms and Conditions
                                    </a>
                                </label>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                variant="primary"
                                size="md"
                                fullWidth
                                className="flex items-center justify-center"
                            >
                                Register Now <FiArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                    
                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link 
                                href="/administration/login"
                                className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center group"
                            >
                                <span>Sign in</span>
                                <FiLogIn className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
                
                {/* Copyright */}
                <p className="mt-4 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} DSCI. All rights reserved.
                </p>
            </div>
        </div>
    );
}