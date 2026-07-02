import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth/LoginPage"
import { DashboardPage} from "../dashboard/DashboardPage";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    )
}