import AssistantCards from "./assistant-card";
import ChatArea from "./chat/chat-area";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const Layout = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch chat history
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/history`)
      .then((res) => setChatHistory(res.data))
      .catch((err) => console.error("Error fetching chat history:", err));
  }, []);

  // Start a new chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/history/new`
      );
      setChatHistory([...chatHistory, res.data]);
      setSelectedChat(res.data);
      console.log(res?.data);
      navigate(`/chat/${res?.data?.chatId}`);
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };
  console.log(chatHistory);

  return (
    <div className="flex h-screen bg-[#0a0c1b] text-white">
      <Sidebar onAddNewChat={handleNewChat} chatHistory={chatHistory} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 lg:max-w-[80%]  max-w-[90%] mx-auto">
          <AssistantCards />
          {chatId ? (
            <ChatArea />
          ) : (
            <p className="text-xl text-center mt-8">
              Please Select or Start a New Chat
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
