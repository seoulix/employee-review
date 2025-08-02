"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Lock, Mail } from "lucide-react"
import { useLoading } from "@/contexts/LoadingContext"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { showLoading, hideLoading, showToast } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Show loading overlay
    showLoading("Signing you in...");
  
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("authToken", data.authToken);
        
        // Hide loading and show success toast
        hideLoading();
        showToast("Login successful! Redirecting...", "success");
        
        // Small delay to show the success message before redirecting
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        let errorMessage = "Login failed";
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (jsonError) {
          console.warn("Failed to parse error response", jsonError);
        }
        
        // Hide loading and show error toast
        hideLoading();
        showToast(errorMessage, "error");
        setError(errorMessage);
      }
  
    } catch (error) {
      console.error("Fetch failed:", error);
      const errorMessage = "Something went wrong. Please check your network or try again later.";
      
      // Hide loading and show error toast
      hideLoading();
      showToast(errorMessage, "error");
      setError(errorMessage);
    }
  };
  

  return (
       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-black">
        <div className="text-center pt-10">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">Admin Login</span>
          <div className="text-gray-400">Sign in to your Employee Review System account</div>
        </div>
        <div className="p-5">

   
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
            <label className="text-sm" htmlFor="email">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full rounded-lg focus:border bg-[#222A38] py-2 flex h-10  border border-input px-3  text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full rounded-lg focus:border bg-[#222A38] py-2 flex h-10  border border-input px-3  text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
                  required
                />
              </div>
            </div>
            <button  style={{borderRadius: "var(--border-radius)"}}  type="submit" className="w-full bg-white text-black p-2 rounded-lg hover:bg-[#ddd]">
              Sign In
            </button>
          </form>
        </div >
      </div>
    </div>
  );
}