import { useEffect } from "react";
import { ChatPage } from "./pages/ChatPage";

const App = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return <ChatPage />;
};

export default App;
