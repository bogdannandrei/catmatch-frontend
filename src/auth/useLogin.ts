import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login } from "../api/authApi";

export function useLogin() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setIsLoading(true);

        try {
            const authResponse = await login({
                identifier,
                password,
            });

            localStorage.setItem("accessToken", authResponse.accessToken);
            localStorage.setItem("refreshToken", authResponse.refreshToken);

            const currentUser = await getCurrentUser(authResponse.accessToken);

            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage("Invalid credentials or server error.");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        identifier,
        setIdentifier,
        password,
        setPassword,
        errorMessage,
        isLoading,
        handleSubmit,
    };
}