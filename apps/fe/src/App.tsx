import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SplashScreen } from "./components/splashScreen/SplashScreen";
import { AuthProvider } from "./providers/auth/authContext";
import { CartProvider } from "./providers/cart/cartContext";
import { Router } from "./Router";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    localStorage.setItem("hasSeenSplash", "true");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {showSplash && <SplashScreen onFinished={handleSplashFinish} />}
          <Router />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
