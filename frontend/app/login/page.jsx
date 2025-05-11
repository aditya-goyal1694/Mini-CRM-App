"use client"
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Exchange Google credential for your own backend JWT
      const res = await axios.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("jwt_token", res.data.token); // Store your JWT!
      router.push("/create-campaign");
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
      {loginError && <p className="text-red-500 mt-3">{loginError}</p>}
    </div>
  );
}