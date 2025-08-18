/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode } from "react"
import Cookies from "js-cookie"
import { UserProfile } from "@/api/types"
import { useGetUserProfile } from "@/services/useGetUserProfile"
import { navigate } from "ionicons/icons"
import { useNavigate } from "react-router"

type AuthContextType = {
  isAuthenticated: boolean
  userId: string | null
  userProfile: UserProfile | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = Cookies.get("accessToken")

  const { data: user, isLoading, error } = useGetUserProfile()
  const navigate = useNavigate();

  if (!user) {
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        userId: user?.userId,
        userProfile: user,
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