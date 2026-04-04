import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./layout/ProtectedRoutes.tsx";
import { AuthPage } from "./pages/authPage/AuthPage.tsx";
import { FooterLayout } from "./layout/FooterLayout.tsx";
import { routes } from "./constants/routes.ts";
import { MainPage } from "./pages/mainPage/MainPage.tsx";
import { HeaderLayout } from "./layout/HeaderLayout.tsx";
import { SearchPage } from "./pages/searchPage/SearchPage.tsx";
import { ProductDetailsPage } from "./pages/productDetailsPage/ProductDetailsPage.tsx";
import { FavoritesPage } from "./pages/favsPage/FavoritesPage.tsx";
import { CartPage } from "./pages/cartPage/CartPage.tsx";
import { ProfilePage } from "./pages/profilePage/ProfilePage.tsx";
import { AdminPage } from "./pages/adminPage/AdminPage.tsx";
import { CheckoutPage } from "./pages/checkoutPage/CheckoutPage.tsx";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.AUTH} element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<FooterLayout />}>
            <Route element={<HeaderLayout />}>
              <Route path={routes.HOME} element={<MainPage />} />
              <Route path={routes.FAVS} element={<FavoritesPage />} />
              <Route path={routes.PROFILE} element={<ProfilePage />} />
              <Route path={routes.CHECKOUT} element={<CheckoutPage />} />
            </Route>
            <Route path={routes.PRODUCTS} element={<SearchPage />} />
            <Route
              path={routes.PRODUCT_DETAILS}
              element={<ProductDetailsPage />}
            />
            <Route path={routes.CART} element={<CartPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path={routes.ADMIN} element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
