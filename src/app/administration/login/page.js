"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/Reducer/authSlice";
import { setLoading } from "@/Redux/Reducer/menuSlice";
import toast from "react-hot-toast";
import Head from "next/head";
import { Input, Button } from "@/Component/UI/ReusableCom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCalendar, FiMapPin, FiDollarSign, FiCreditCard, FiCheck } from "react-icons/fi";

// Icons for inputs
const EmailIcon = () => <FiMail className="h-5 w-5 text-gray-400" />;
const LockIcon = () => <FiLock className="h-5 w-5 text-gray-400" />;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.menu?.loading ?? false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    dispatch(setLoading(true));
    
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        document.cookie = `rsvAuthToken=${data.token}; path=/;`;
        dispatch(login({ token: data.token, role: data.role, user: data.user }));
        toast.success("Logged in successfully");
        router.push("/administration/dashboard");
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Head>
        <title>Login - DSCI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Sign in to continue to DSCI
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
              icon={EmailIcon}
              className="mb-4"
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
                icon={LockIcon}
                className="mb-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-xs text-primary hover:text-primary-dark transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
                onClick={() => {/* Add forgot password functionality */}}
              >
                Forgot password?
              </button>
            </div>
            
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
         
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
                onClick={() => {router.push("/administration/register")}}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        :root {
          --primary: var(--bs-primary);
          --primary-dark: #0a58ca;
          --gray-100: var(--bs-gray-100);
          --gray-200: var(--bs-gray-200);
          --gray-300: var(--bs-gray-300);
          --gray-400: var(--bs-gray-400);
          --gray-500: var(--bs-gray-500);
          --gray-600: var(--bs-gray-600);
          --gray-700: var(--bs-gray-700);
          --gray-800: var(--bs-gray-800);
          --gray-900: var(--bs-gray-900);
        }
        
        body {
          background-color: var(--gray-100);
        }
        
        .text-primary {
          color: var(--primary);
        }
        
        .hover\:text-primary-dark:hover {
          color: var(--primary-dark);
        }
        
        .bg-primary {
          background-color: var(--primary);
        }
        
        .hover\:bg-primary-dark:hover {
          background-color: var(--primary-dark);
        }
        
        .border-primary {
          border-color: var(--primary);
        }
        
        .focus\:ring-primary:focus {
          --tw-ring-color: var(--primary);
        }
      `}</style>
    </>
  );
}
