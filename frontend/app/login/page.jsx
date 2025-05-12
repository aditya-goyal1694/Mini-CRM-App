"use client"
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  // On successful Google login, exchange Google's credential for your app's JWT
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      );
      localStorage.setItem("jwt_token", res.data.token); // Store JWT for subsequent API calls
      router.push("/create-campaign"); // Redirect on success
    } catch (err) {
      setLoginError("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-6 text-2xl font-bold">Sign in with Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setLoginError("Google Login Failed")}
      />
      {/* Show error if login fails */}
      {loginError && <p className="text-red-500 mt-3">{loginError}</p>}
    </div>
  );
}