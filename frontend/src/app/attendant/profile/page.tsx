"use client"
import { useAuth } from "@/context/auth-context"

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  )
}
