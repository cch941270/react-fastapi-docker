import { type AccessToken } from "../types/types";

export function getToken(): AccessToken | null {
  const tokenData = localStorage.getItem("accessToken");
  if (tokenData) {
    return JSON.parse(tokenData);
  } else {
    return null;
  }
}
