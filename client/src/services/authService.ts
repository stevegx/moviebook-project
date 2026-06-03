// einai to backend mou gia to register kai login, to xrisimopoiw gia na kanw fetch requests apo ta pages mou
const API_URL = "http://localhost:3000/api/auth";

export const registerUser = async (userData: { 
    username: string;
    firstName: string;
    lastName: string;
    city: string; 
    email: string;
    password: string; 
    }) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
    }

};

export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
    }


};