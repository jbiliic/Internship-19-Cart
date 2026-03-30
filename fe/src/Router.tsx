import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./layout/ProtectedRoutes";
import { AuthPage } from "./pages/authPage/AuthPage";
import { FooterLayout } from "./layout/FooterLayout.tsx";
import { routes } from "./constants/routes";
import { MainPage } from "./pages/mainPage/MainPage";
import { HeaderLayout } from "./layout/HeaderLayout.tsx";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.AUTH} element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<FooterLayout />}>
            <Route element={<HeaderLayout />}>
              <Route path={routes.HOME} element={<MainPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          {/* <Route path={ routes.ADMIN} element={<div>Admin Panel</div>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
