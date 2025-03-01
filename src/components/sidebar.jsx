import React from "react";
import { useNavigate, useParams } from "react-router";
import { setSelectedChat } from "../redux/reducers/chat";
import { useDispatch } from "react-redux";

const Sidebar = ({ onAddNewChat, chatHistory }) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const chats = [
    { id: 1, title: "New Chat", date: "2/24/2025", active: true },
    { id: 2, title: "hi", date: "2/24/2025" },
    { id: 3, title: "tell me about this image", date: "2/24/2025" },
    { id: 4, title: "PRD Chat", date: "2/24/2025" },
    { id: 5, title: "General", date: "2/24/2025" },
    { id: 6, title: "Legal", date: "2/24/2025" },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 flex flex-col px-4">
      <div className="p-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
          onClick={onAddNewChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {chatHistory?.map((chat) => (
          <div
            key={chat.chatId}
            className={`p-3 cursor-pointer hover:bg-gray-800 transition-colors rounded-lg mb-2 ${
              chat.chatId == chatId ? "bg-gray-800" : ""
            }`}
            onClick={() => {
              dispatch(setSelectedChat(chat));
              navigate(`/chat/${chat.chatId}`);
            }}
          >
            <div className="font-medium">{chat.title}</div>
            <div className="text-xs text-gray-400">{chat.date}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
