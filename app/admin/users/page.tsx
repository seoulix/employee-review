"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit, Save, Search, Loader2, Mail, Phone } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { json } from "stream/consumers"

interface User {
  id: string
  full_name: string
  email: string
  phone?: string
  role: "super_admin" | "admin" | "manager" | "agent"
  is_active: boolean
  last_login?: string
  created_at?: string
  permissions?: string[]
}

interface Role {
  id: string
  name: string
  display_name: string
  permissions: string[]
}

const defaultPermissions = [
  "dashboard.view",
  "brands.view",
  "brands.create",
  "brands.edit",
  "brands.delete",
  "outlets.view",
  "outlets.create",
  "outlets.edit",
  "outlets.delete",
  "employees.view",
  "employees.create",
  "employees.edit",
  "employees.delete",
  "feedback.view",
  "feedback.create",
  "feedback.edit",
  "feedback.delete",
  "reports.view",
  "reports.export",
  "settings.view",
  "settings.edit",
  "users.view",
  "users.create",
  "users.edit",
  "users.delete",
]

const rolePermissions = {
  super_admin: defaultPermissions,
  admin: defaultPermissions.filter((p) => !p.includes("users.")),
  manager: [
    "dashboard.view",
    "brands.view",
    "outlets.view",
    "employees.view",
    "feedback.view",
    "reports.view",
    "reports.export",
  ],
  agent: ["dashboard.view", "employees.view", "feedback.view", "feedback.create"],
}

export default function UserManagementPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "manager" as const,
    password: "",
    is_active: true,
    permissions: [] as string[],
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  const saveUser = async (userData: any) => {
    try {
      setSaving(true)
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${editingUser ? "updated" : "created"} successfully`,
        })
        // loadUsers()
        const json: object = await response.json();
        if (editingUser == null) { 
          setUsers(prev => [...prev, { ...newUser, id: json.id }]) 
        }
        else {
        
      loadUsers()
        }
        setShowAddDialog(false)
        setEditingUser(null)
        resetForm()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to save user")
      }
    } catch (error: any) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE"      })
      
      const json = await response.json();
      if (json.status) {
       
   
        loadUsers();
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const toggleUserStatus = async (id: string, is_active: boolean) => {
    try {
      const response = await fetch(`/api/users/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${is_active ? "activated" : "deactivated"} successfully`,
        })
        loadUsers()
      } else {
        throw new Error("Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setNewUser({
      full_name: "",
      email: "",
      phone: "",
      role: "agent",
      password: "",
      is_active: true,
      permissions: [],
    })
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setNewUser({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "",
      is_active: user.is_active,
      permissions: user.permissions,
    })
    setShowAddDialog(true)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "manager":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "agent":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage system users and their permissions</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button  style={{borderRadius: "var(--border-radius)"}}
                onClick={() => {
                  resetForm()
                  setEditingUser(null)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    placeholder="Enter full Name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="password">
                    {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newUser.is_active}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, is_active: checked })}
                  />
                  <Label htmlFor="active">Active User</Label>
                </div>

                <div className="flex gap-2">
                  <Button  style={{borderRadius: "var(--border-radius)"}} onClick={() => saveUser(newUser)} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingUser ? "Update User" : "Create User"}
                      </>
                    )}
                  </Button>
                  <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="searchUser"
                    autoComplete="false"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>{formatRole(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={(checked) => toggleUserStatus(user.id, checked)}
                          size="sm"
                        />
                        <span className={`text-sm ${user.is_active ? "text-green-600" : "text-red-600"}`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => startEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button  style={{borderRadius: "var(--border-radius)"}}
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          disabled={user.role === "super_admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
