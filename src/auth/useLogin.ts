import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { saveAuthSession } from "./authStorage";

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


            saveAuthSession(
                authResponse.accessToken,
                authResponse.refreshToken,
                authResponse.user
            );

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