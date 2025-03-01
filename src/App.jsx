// import Header from "./components/Header";
// import ChatArea from "./components/ChatArea";
// import AssistantCards from "./components/AssistantCards";

import AssistantCards from "./components/assistant-card";
import { ChatArea } from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

import { Provider } from "react-redux";
import store from "./redux/store";
import { useEffect } from "react";

function App() {
  // a mock cal to api to awake the server
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}`);
  }, []);
  return (
    <Provider store={store}>
      <div className="flex h-screen bg-[#0a0c1b] text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6 lg:max-w-[80%]  max-w-[90%] mx-auto">
            <AssistantCards />
            <ChatArea />
          </main>
        </div>
      </div>
    </Provider>
  );
}

export default App;
