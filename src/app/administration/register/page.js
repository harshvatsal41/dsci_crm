'use client';
import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { Input, Button } from '@/Component/UI/ReusableCom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const initialState = {
    username: '', 
    email: '', 
    password: '', 
    contactNo: '',
    isVerified: false,
    isAdmin: false,
    isDisabled: false
};

export default function Register() {
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    contactNo: formData.contactNo.replace(/\D/g, '') // Remove non-numeric characters
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle validation errors
                if (res.status === 400) {
                    // Handle Mongoose validation errors
                    if (data.errors) {
                        const validationErrors = {};
                        Object.keys(data.errors).forEach(key => {
                            validationErrors[key] = data.errors[key].message;
                        });
                        setErrors(validationErrors);
                        toast.error('Please fix the form errors');
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            form: data.message || 'Validation failed'
                        }));
                        toast.error(data.message || 'Validation failed');
                    }
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
                return;
            }

            // Registration successful
            toast.success('Registration successful! Please log in.');
            router.push('/administration/login');
            
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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
                        {errors.form && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                                {errors.form}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <Input
                                label="Username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                error={errors.username}
                                icon={FiUser}
                                minLength={3}
                                maxLength={30}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                            )}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                                icon={FiMail}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                        
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
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                error={errors.password}
                                icon={FiLock}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password.includes('shorter than the minimum allowed length') 
                                        ? 'Password must be at least 8 characters long'
                                        : errors.password
                                    }
                                </p>
                            )}
                        </div>
                        
                        {/* Contact Number */}
                        <div>
                            <Input
                                label="Contact Number"
                                name="contactNo"
                                type="tel"
                                placeholder="1234567890"
                                value={formData.contactNo}
                                onChange={handleChange}
                                required
                                error={errors.contactNo}
                                icon={FiPhone}
                                maxLength="15"
                            />
                            {errors.contactNo && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.contactNo.includes('valid contact number') 
                                        ? 'Please enter a valid 10-digit phone number'
                                        : errors.contactNo
                                    }
                                </p>
                            )}
                        </div>
                        
                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                variant="primary"
                                size="md"
                                fullWidth
                                loading={isLoading}
                                disabled={isLoading}
                                className="flex items-center justify-center"
                            >
                                {isLoading ? 'Registering...' : 'Register Now'} 
                                {!isLoading && <FiArrowRight className="ml-2 h-4 w-4" />}
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