import { API_URL } from '@/config'

export const register = async (credentials: {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
  } catch (error) {
    throw error;
  }
};

export const user = async (updatedData?: {
  name: string;
  username: string;
  email: string;
}) => {
  try {
    const method = updatedData ? "POST" : "GET";

    const response = await fetch(`${API_URL}/user`, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: updatedData ? JSON.stringify(updatedData) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Credential failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    throw error;
  }
};
