"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/Reducer/authSlice";
import { setLoading } from "@/Redux/Reducer/menuSlice";
import { InputField } from "@/Component/UI/ReusableCom";
import { Eye, EyeOff } from "lucide-react";
import { LoginApi } from "@/utilities/ApiManager";
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.menu?.loading ?? false);
  const router = useRouter();


  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    dispatch(setLoading(true));

    const res = await LoginApi(formData);
    console.log("res",res); 
  
    if (res.statusCode===200) {
      document.cookie = `rsvAuthToken=${res.token}; path=/;`;
      dispatch(login({ token: res.token, role: res.role, user: res.user }));
      setMessage("Logged in successfully");
      router.push("/administration/dashboard");
    } else {
      setMessage(res.error);
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">Sign In</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">to continue with DSCI CRM</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            id="login-email"
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            required
          />
          
          <div className="relative">
            <InputField
              id="login-password"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {message && (
            <p className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}