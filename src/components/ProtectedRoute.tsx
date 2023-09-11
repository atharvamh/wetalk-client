import { Navigate, Outlet } from "react-router-dom";
import localStorageService from "../services/localStorageService";

export default function ProtectedRoute(){
    const token = localStorageService.get("x-token");

    return (
        token ? <Outlet /> : <Navigate to="/" />
    )
}