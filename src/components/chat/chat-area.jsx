import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, sendMessage, setError } from "../../redux/reducers/chat";
import axios from "axios";
import { ArrowSend } from "../icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router";

const ChatArea = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { chatHistory, loading, error } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [failedMessage, setFailedMessage] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const geCurrentChat = () => {
    try {
      axios
        .get(`${BASE_URL}/api/history/${chatId}`)
        .then((res) => setSelectedChat(res.data))
        .catch((err) => {
          console.error("Error fetching chat:", err);
          navigate("/");
        });
    } catch (e) {
      console.error("Error fetching chat:", e);
      navigate("/");
    }
  };

  // ✅ Fetch chat history for this chatId
  useEffect(() => {
    if (chatId) {
      geCurrentChat();
    }
  }, [chatId]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [selectedChat, failedMessage]);

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Handle Enter key press (send message instead of new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit(e);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const sendMessageToAPI = async (chatId, message, image) => {
    if (!chatId || (!message.trim() && !image)) return;

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("message", message);
    formData.append("sender", "user");
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/history/${chatId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  const handleSubmit = async (e, retry = false) => {
    e.preventDefault();
    if (!selectedChat) return;
    dispatch(setLoading(true));

    const messageToSend = retry ? failedMessage.message : message;
    const imageToSend = retry ? failedMessage.image : image;

    const userMessage = {
      id: Date.now().toString(),
      chatId: selectedChat.chatId,
      sender: "user",
      message: messageToSend,
      type: imageToSend ? "image" : "text",
      timestamp: new Date().toISOString(),
      imageUrl: imagePreview || null,
    };

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, userMessage],
    });

    setMessage("");
    setImage(null);
    setImagePreview(null);
    setFailedMessage(null);

    try {
      await sendMessageToAPI(selectedChat.chatId, messageToSend, imageToSend);
      setTimeout(() => {
        axios.get(`${BASE_URL}/api/history/${chatId}`).then((res) => {
          setSelectedChat(res.data);
        });
      }, 2000);
    } catch (err) {
      setFailedMessage({ message: messageToSend, image: imageToSend });
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-[#131629] text-white">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {error && <p className="text-red-500">{error}</p>}
        {selectedChat?.messages?.length === 0 && (
          <p className="text-white flex items-center justify-center text-xl">
            No messages found
          </p>
        )}

        {selectedChat?.messages?.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs p-3 rounded-lg shadow-md bg-gray-700 text-white">
              {chat.imageUrl && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${chat?.imageUrl}`}
                  alt="Uploaded"
                  className="mb-2 rounded-md"
                />
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {DOMPurify.sanitize(chat.message)}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-4"></div>
            Generating Response...
          </div>
        )}

        {/* ✅ Retry Button for Failed Messages */}
        {failedMessage && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={(e) => handleSubmit(e, true)}
            >
              Retry Last Message
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1A1D36] p-4 border-t">
        {imagePreview && (
          <div className="relative mb-2 flex justify-center">
            <img
              src={imagePreview}
              alt="preview"
              className="w-24 h-24 rounded-md shadow-md"
            />
            <button
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
              onClick={removeImage}
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <label className="cursor-pointer">
            <span className="hidden">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <svg
              className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </label>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-[#131629] text-white rounded-lg px-4 py-3"
            rows="1"
          />
          <button type="submit" className="p-3 bg-blue-600 rounded-lg">
            <ArrowSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
