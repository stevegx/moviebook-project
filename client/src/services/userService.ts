const API_URL = "http://localhost:3000/api/users";

export const getProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch profile")
    }

    return await response.json();
};