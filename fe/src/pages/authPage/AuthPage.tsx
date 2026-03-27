import { useState } from "react";
import { LoginCard } from "../../components/loginCard/LoginCard";
import { RegisterCard } from "../../components/registerCard/RegisterCard";

export const AuthPage = () => {
  const [wantsToLogin, setWantsToLogin] = useState(true);
  return (
    <div>
      {wantsToLogin ? (
        <LoginCard onToggle={() => setWantsToLogin(false)} />
      ) : (
        <RegisterCard onToggle={() => setWantsToLogin(true)} />
      )}
    </div>
  );
};
