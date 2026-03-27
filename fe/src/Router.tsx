import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./layout/ProtectedRoutes";
import { AuthPage } from "./pages/authPage/AuthPage";
import { MainLayout } from "./layout/MainLayout";
import { routes } from "./constants/routes";
import { MainPage } from "./pages/mainPage/MainPage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.AUTH} element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={routes.HOME} element={<MainPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          {/* <Route path={ routes.ADMIN} element={<div>Admin Panel</div>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
