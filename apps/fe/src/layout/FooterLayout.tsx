import { Outlet } from "react-router-dom";
import { FooterNav } from "../components/footerNav/FooterNav";

export const FooterLayout = () => {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <main>
        <Outlet />
      </main>
      <FooterNav />
    </div>
  );
};
