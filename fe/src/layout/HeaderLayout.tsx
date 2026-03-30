import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";

export const HeaderLayout = () => {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
