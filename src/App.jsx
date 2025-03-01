import { Provider } from "react-redux";
import store from "./redux/store";
import { useEffect } from "react";
import axios from "axios";
import Layout from "./components/layout";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  // a mock cal to api to awake the server
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}`);
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/chat/:chatId" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
