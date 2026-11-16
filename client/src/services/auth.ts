import { API_URL } from "@/config";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export type ProfileInput = Pick<UserProfile, "name" | "username" | "email">;

type Credentials = { email: string; password: string };
type Registration = Credentials & ProfileInput & { password_confirmation: string };

async function request<T>(path: string, method = "GET", body?: object): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const register = (credentials: Registration) =>
  request<UserProfile>("/auth/register", "POST", credentials);

export const login = (credentials: Credentials) =>
  request<UserProfile>("/auth/login", "POST", credentials);

export const user = () => request<UserProfile>("/user");

export const updateProfile = (id: string, changes: ProfileInput) =>
  request<UserProfile>(`/user/${encodeURIComponent(id)}/information`, "PATCH", changes);

export const logout = () => request<{ message: string }>("/auth/logout", "POST");
