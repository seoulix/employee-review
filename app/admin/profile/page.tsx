"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLayout from "@/components/admin-layout";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    id: undefined,
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user profile using verify-access and authToken
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/verify-access", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // The user object is inside data.user.verifyAdmin[0]
        const user = data.user?.verifyAdmin?.[0];
        if (user) {
          setProfile({
            id: user.id,
            name: user.full_name  || "",
            email: user.email || "",
            avatar: user.avatar || "",
          });
        } else {
          setError("User not found");
        }
      } else {
        setError("Failed to fetch user profile");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not authenticated");
      setSaving(false);
      return;
    }
    // Update profile using the /api/profile endpoint (PUT)
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: profile.id,
        name: profile.name,
        email: profile.email,
      }),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Failed to update profile.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <AdminLayout>

    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{profile.name ? profile.name[0] : "A"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg">{profile.name}</div>
                <div className="text-gray-500">{profile.email}</div>
              </div>
            </div> */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input name="name" value={profile.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input name="email" value={profile.email} onChange={handleChange} required type="email" />
            </div>
            {/* <div>
              <label className="block mb-1 font-medium">Old Password</label>
              <Input name="email" value={profile.email} onChange={handleChange} required type="email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <Input name="email" value={profile.email} onChange={handleChange} required type="email" />
            </div> */}
            {/* <div>
              <label className="block mb-1 font-medium">Avatar URL</label>
              <Input name="avatar" value={profile.avatar} onChange={handleChange} />
            </div> */}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            
            {success && <div className="text-green-600 text-center">Profile updated successfully!</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
} 