/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode } from "react"
import Cookies from "js-cookie"
import { UserProfile } from "@/api/types"
import { useGetUserProfile } from "@/services/useGetUserProfile"

type AuthContextType = {
  isAuthenticated: boolean
  userId: string | null
  userProfile: UserProfile | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = Cookies.get("accessToken")
  const isAuthenticated = !!accessToken

  // Only fetch user profile if authenticated
  const { data: user } = useGetUserProfile({}, { enabled: isAuthenticated })

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId: user?.userId || null,
        userProfile: user || null,
        logout: () => {
          Cookies.remove("accessToken")
          Cookies.remove("refreshToken")
          Cookies.remove("userid")
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}