"use client"
import { useEffect, useState } from "react"

export function useAuthProfile() {
  const [profile, setProfile] = useState({
    isAuthenticated: false,
    profile: "",
    firstName: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenicated") === "true"
      const profileImg = localStorage.getItem("profile") || ""
      const firstName = localStorage.getItem("firstName") || ""
      setProfile({ isAuthenticated, profile: profileImg, firstName })
    }
  }, [])

  return profile
}
