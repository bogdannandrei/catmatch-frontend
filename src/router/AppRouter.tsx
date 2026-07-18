import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/LoginPage";
import { DashboardPage } from "../dashboard/DashboardPage";
import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import {MyCatsPage} from "../cats/MyCatsPage.tsx";
import {CreateCatPage} from "../cats/CreateCatPage.tsx";
import {EditCatPage} from "../cats/EditCatPage.tsx";
import {DiscoverCatsPage} from "../cats/DiscoverCatsPage.tsx";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/my-cats" element={<MyCatsPage />} />
                <Route path="/my-cats/new" element={<CreateCatPage />} />
                <Route path="/my-cats/:id/edit" element={<EditCatPage />} />
                <Route path="/discover" element={<DiscoverCatsPage />} />
            </Route>
        </Routes>


    );
}