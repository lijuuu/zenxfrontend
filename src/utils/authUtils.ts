
import Cookies from "js-cookie";

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get("accessToken");
  return !!accessToken;
};


export const getFullName = (user: any) => {
  if (!user) return "User";
  
  if (user.fullName) return user.fullName;
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.firstName) return user.firstName;
  
  if (user.userName) return user.userName;
  
  return "User";
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("auth");
  window.location.href = "/";
};
